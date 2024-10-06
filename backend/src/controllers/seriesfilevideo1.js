const axios = require('axios');
const {
  Series,
  Season,
  Episode,
  Cast,
  Genre,
  ProductionCompany,
  SeriesCast,
  SeriesProductionCompanies,
} = require('../models');

// Variáveis para armazenar o estado do processamento
let totalFiles = 0; // Total de arquivos a serem processados
let processedFiles = 0; // Arquivos já processados

// Função para buscar as pastas da API do FileMoon
const fetchFoldersFromAPI = async () => {
  try {
    const url = `https://filemoonapi.com/api/folder/list?key=32432nh97do6cze51lwrb&fld_id=136501`;
    const response = await axios.get(url);
    return response.data.result.folders;
  } catch (error) {
    console.error('Error fetching folders from FileMoon API:', error.message);
    throw error;
  }
};

// Função para buscar os arquivos dentro de uma pasta
const fetchFilesFromFolder = async (fld_id) => {
  try {
    const url = `https://filemoonapi.com/api/file/list?key=32432nh97do6cze51lwrb&fld_id=${fld_id}`;
    const response = await axios.get(url);
    return response.data.result.files;
  } catch (error) {
    console.error('Error fetching files from folder:', error.message);
    throw error;
  }
};

// Controlador para buscar e salvar os arquivos da série
const SeriesFileController = {
  async fetchAndSaveSeriesFiles(req, res) {
    try {
      console.log('Fetching folders from FileMoon API...');
      const folders = await fetchFoldersFromAPI();
      console.log('Folders fetched:', folders);

      // Resetar contadores
      totalFiles = 0;
      processedFiles = 0;

      for (const folder of folders) {
        const { name, fld_id } = folder;
        console.log(`Processing folder: ${name}`);

        // Extrair tmdb_id do nome da pasta
        const tmdbIdMatch = name.match(/\s-\s\((\d+)\)$/);
        const tmdb_id = tmdbIdMatch ? tmdbIdMatch[1] : null;

        if (!tmdb_id) {
          console.warn(`tmdb_id not found in folder name: ${name}. Skipping...`);
          continue;
        }

        console.log(`Extracted tmdb_id: ${tmdb_id}`);

        try {
          const tmdbResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          const seriesData = tmdbResponse.data;
          console.log(`Fetched data for TMDB ID ${tmdb_id}:`, seriesData);

          // Upsert da série no banco de dados
          const [series] = await Series.upsert({
            tmdb_id: seriesData.id,
            name: seriesData.name,
            overview: seriesData.overview,
            backdrop_path: seriesData.backdrop_path,
            first_air_date: seriesData.first_air_date,
            last_air_date: seriesData.last_air_date,
            number_of_episodes: seriesData.number_of_episodes,
            number_of_seasons: seriesData.number_of_seasons,
            original_language: seriesData.original_language,
            status: seriesData.status,
            popularity: seriesData.popularity,
            vote_average: seriesData.vote_average,
            vote_count: seriesData.vote_count,
            homepage: seriesData.homepage,
            poster_path: seriesData.poster_path,
          });

          // Upsert de gêneros
          const genres = seriesData.genres || [];
          for (const genre of genres) {
            await Genre.upsert({
              id: genre.id,
              name: genre.name,
            });
            await series.addGenre(genre.id);
          }

          // Upsert de empresas de produção
          const productionCompanies = seriesData.production_companies || [];
          for (const production of productionCompanies) {
            const [productionCompany] = await ProductionCompany.upsert({
              tmdb_id: production.id,
              name: production.name,
              logo_path: production.logo_path,
              origin_country: production.origin_country,
            });

            await SeriesProductionCompanies.upsert({
              series_tmdb_id: seriesData.id,
              production_company_id: productionCompany.tmdb_id,
            });
          }

          // Buscar e upsert dados do elenco
          const castResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          const castData = castResponse.data.cast || [];

          if (castData.length > 0) {
            for (const actor of castData) {
              try {
                // Upsert ator
                const [actorEntry] = await Cast.upsert({
                  tmdb_id: actor.id,
                  tmdb_cast_id: actor.id,
                  name: actor.name,
                  character_name: actor.character,
                  profile_path: actor.profile_path,
                  gender: actor.gender,
                });

                if (actorEntry) {
                  const castId = actorEntry.id; // ID do ator

                  // Upsert a relação em SeriesCast
                  await SeriesCast.upsert({
                    series_tmdb_id: seriesData.id,
                    cast_id: castId,
                    character_name: actor.character,
                    profile_path: actor.profile_path,
                  });
                } else {
                  console.error(`Failed to insert/update actor: ${actor.name}`);
                }

              } catch (error) {
                console.error(`Error processing actor ${actor.name}:`, error.message);
              }
            }
          } else {
            console.log('No cast data found for this series.');
          }

          // Buscar arquivos da pasta
          const files = await fetchFilesFromFolder(fld_id);
          console.log(`Files fetched for folder ${fld_id}:`, files);

          totalFiles += files.length; // Atualiza o total de arquivos

          // Processar cada arquivo para salvar episódios
          for (const file of files) {
            const { title, file_code } = file; // Usar file_code

            // Construir o link do vídeo
            const videoLink = `https://filemoon.sx/e/${file_code}`;

            // Extrair temporada e episódio do título
            const episodeMatch = title.match(/S(\d{2})E(\d{2})/);
            const season_number = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
            const episode_number = episodeMatch ? parseInt(episodeMatch[2], 10) : null;

            if (!season_number || !episode_number) {
              console.warn(`Could not extract season or episode from title: ${title}. Skipping...`);
              continue;
            }

            console.log(`Extracted season ${season_number} and episode ${episode_number} from title: ${title}`);

            // Verificar se a temporada existe
            let season = await Season.findOne({
              where: { series_tmdb_id: seriesData.id, season_number },
            });

            if (!season) {
              // Buscar detalhes da temporada se não encontrado
              const seasonResponse = await axios.get(
                `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
              );
              const seasonData = seasonResponse.data;

              // Criar a temporada no banco de dados
              season = await Season.create({
                series_tmdb_id: seriesData.id,
                season_number: seasonData.season_number,
                air_date: seasonData.air_date,
                episode_count: seasonData.episodes.length,
                overview: seasonData.overview,
                poster_path: seasonData.poster_path,
                vote_average: seasonData.vote_average,
              });
            }

            // Verificar se o episódio já existe
            const existingEpisode = await Episode.findOne({
              where: { season_id: season.id, episode_number },
            });

            if (existingEpisode) {
              console.log(`Episode ${existingEpisode.name} already exists. Skipping...`);
              continue; // Pular se o episódio já existir
            }

            // Buscar detalhes do episódio
            const episodeResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}/episode/${episode_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
            );
            const episodeData = episodeResponse.data;

            // Criar o episódio no banco de dados
            const episode = await Episode.create({
              name: episodeData.name,
              overview: episodeData.overview,
              season_id: season.id,
              episode_number,
              vote_average: episodeData.vote_average,
              vote_count: episodeData.vote_count,
              air_date: episodeData.air_date,
              still_path: episodeData.still_path,
              link: videoLink, // Usar o link do vídeo construído
            });

            console.log(`Saved episode: ${episode.name}`);

            // Incrementar o número de arquivos processados
            processedFiles++;
            console.log(`Processed ${processedFiles} of ${totalFiles} files.`);
          }

        } catch (error) {
          console.error(`Error processing folder ${name} with tmdb_id ${tmdb_id}:`, error.message);
        }
      }

      console.log(`Finished processing. Total files: ${totalFiles}, Processed files: ${processedFiles}.`);
      res.status(200).json({ message: 'Process completed successfully.' });

    } catch (error) {
      console.error('Error in fetchAndSaveSeriesFiles:', error.message);
      res.status(500).json({ message: 'Error fetching and saving series files.' });
    }
  },

  // Rota para verificar o status do processamento
  
};

module.exports = SeriesFileController;
