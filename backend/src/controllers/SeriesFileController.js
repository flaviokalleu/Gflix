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

// Variáveis para armazenar o estado do processamento e cache
let totalFiles = 0;
let processedFiles = 0;
const tmdbCache = {};

// Função para buscar os arquivos da nova API até não haver mais páginas
const fetchFilesFromAPI = async () => {
  const allFiles = [];
  let page = 1;
  let hasMoreFiles = true;

  while (hasMoreFiles) {
    try {
      const url = `https://vidhideapi.com/api/file/list?key=32994a6f8bq2e30fkz632&page=${page}`;
      const response = await axios.get(url);
      
      // Adicionar os arquivos da página atual ao array total
      const files = response.data.result.files;
      if (files && files.length > 0) {
        allFiles.push(...files);
        page++; // Avança para a próxima página
      } else {
        hasMoreFiles = false; // Não há mais arquivos, então para o loop
      }
    } catch (error) {
      console.error('Error fetching files from API:', error.message);
      hasMoreFiles = false; // Para o loop em caso de erro
    }
  }

  return allFiles;
};

// Função para buscar dados da TMDB com cache
const fetchTmdbData = async (tmdb_id) => {
  if (tmdbCache[tmdb_id]) {
    console.log(`Fetching from cache for TMDB ID ${tmdb_id}`);
    return tmdbCache[tmdb_id];
  }

  try {
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
    );
    tmdbCache[tmdb_id] = tmdbResponse.data; // Cache the result
    return tmdbResponse.data;
  } catch (error) {
    console.error(`Error fetching TMDB data for ID ${tmdb_id}:`, error.message);
    throw error;
  }
};

// Controlador para buscar e salvar os arquivos da série
const SeriesFileController = {
  async fetchAndSaveSeriesFiles(req, res) {
    try {
      console.log('Fetching files from VidHide API...');
      const files = await fetchFilesFromAPI();
      console.log('Files fetched:', files);

      // Resetar contadores
      totalFiles = files.length;
      processedFiles = 0;

      for (const file of files) {
        const { title, file_code } = file;

        // Extrair tmdb_id do título
        const tmdbIdMatch = title.match(/\s-\s\((\d+)\)\s-\s\(S(\d+)E(\d+)\)/);
        const tmdb_id = tmdbIdMatch ? tmdbIdMatch[1] : null;
        const season_number = tmdbIdMatch ? parseInt(tmdbIdMatch[2], 10) : null;
        const episode_number = tmdbIdMatch ? parseInt(tmdbIdMatch[3], 10) : null;

        if (!tmdb_id || !season_number || !episode_number) {
          console.warn(`Could not extract tmdb_id, season, or episode from title: ${title}. Skipping...`);
          continue;
        }

        console.log(`Processing file for series: ${title} (tmdb_id: ${tmdb_id}, S${season_number}E${episode_number})`);

        try {
          // Buscar detalhes da série com cache
          const seriesData = await fetchTmdbData(tmdb_id);
          console.log(`Fetched data for TMDB ID ${tmdb_id}:`, seriesData);

          // Upsert da série
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

          // Criar ou buscar a temporada
          let season = await Season.findOne({
            where: { series_tmdb_id: seriesData.id, season_number },
          });

          if (!season) {
            const seasonResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
            );
            const seasonData = seasonResponse.data;

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

          // Criar ou buscar o episódio
          const episodeResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}/episode/${episode_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          const episodeData = episodeResponse.data;

          await Episode.upsert({
            name: episodeData.name,
            overview: episodeData.overview,
            season_id: season.id,
            episode_number,
            vote_average: episodeData.vote_average,
            vote_count: episodeData.vote_count,
            air_date: episodeData.air_date,
            still_path: episodeData.still_path,
            link: `https://vidhideplus.com/embed/${file_code}`, // Usar o link do vídeo
          });

          // Incrementar o número de arquivos processados
          processedFiles++;
          console.log(`Processed ${processedFiles} of ${totalFiles} files.`);

        } catch (error) {
          console.error(`Error processing file for tmdb_id ${tmdb_id}:`, error.message);
        }
      }

      console.log(`Finished processing. Total files: ${totalFiles}, Processed files: ${processedFiles}.`);
      res.status(200).json({ message: 'Process completed successfully.' });

    } catch (error) {
      console.error('Error in fetchAndSaveSeriesFiles:', error.message);
      res.status(500).json({ message: 'Error fetching and saving series files.' });
    }
  },
};

module.exports = SeriesFileController;
