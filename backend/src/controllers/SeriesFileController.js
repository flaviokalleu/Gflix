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

// Função para buscar arquivos na nova API
const fetchFilesFromVidHideAPI = async () => {
  try {
    const url = `https://vidhideapi.com/api/file/list?key=32994a6f8bq2e30fkz632`;
    const response = await axios.get(url);
    return response.data.result.files;
  } catch (error) {
    console.error('Error fetching files from VidHide API:', error.message);
    throw error;
  }
};

// Controlador para buscar e salvar os arquivos da série
const SeriesFileController = {
  async fetchAndSaveSeriesFiles(req, res) {
    try {
      console.log('Fetching files from VidHide API...');
      const files = await fetchFilesFromVidHideAPI();
      console.log('Files fetched:', files);

      // Resetar contadores
      totalFiles = files.length;
      processedFiles = 0;

      for (const file of files) {
        const { title, file_code } = file; // Usar file_code

        // Ajustar expressão regular para extrair nome da série, temporada e episódio
        const episodeMatch = title.match(/(.+?)S(\d{2})E(\d{2})/);
        const seriesName = episodeMatch ? episodeMatch[1].trim() : null;
        const season_number = episodeMatch ? parseInt(episodeMatch[2], 10) : null;
        const episode_number = episodeMatch ? parseInt(episodeMatch[3], 10) : null;

        if (!seriesName || !season_number || !episode_number) {
          console.warn(`Could not extract series name, season or episode from title: ${title}. Skipping...`);
          continue;
        }

        console.log(`Extracted series name: ${seriesName}, season: ${season_number}, episode: ${episode_number}`);

        // Buscar tmdb_id pela API TMDB usando o nome da série
        let tmdb_id = null;

        try {
          const searchResponse = await axios.get(
            `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(seriesName)}&language=pt-BR`
          );
          const seriesData = searchResponse.data.results[0]; // Pega o primeiro resultado

          if (seriesData) {
            tmdb_id = seriesData.id;
            console.log(`Found TMDB ID ${tmdb_id} for series: ${seriesName}`);
          } else {
            console.warn(`No TMDB ID found for series: ${seriesName}. Skipping...`);
            continue;
          }
        } catch (error) {
          console.error(`Error fetching TMDB ID for series ${seriesName}:`, error.message);
          continue;
        }

        // Upsert da série no banco de dados
        let series;
        try {
          const tmdbResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          series = tmdbResponse.data; // Armazena os dados da série

          await Series.upsert({
            tmdb_id: series.id,
            name: series.name,
            overview: series.overview,
            backdrop_path: series.backdrop_path,
            first_air_date: series.first_air_date,
            last_air_date: series.last_air_date,
            number_of_episodes: series.number_of_episodes,
            number_of_seasons: series.number_of_seasons,
            original_language: series.original_language,
            status: series.status,
            popularity: series.popularity,
            vote_average: series.vote_average,
            vote_count: series.vote_count,
            homepage: series.homepage,
            poster_path: series.poster_path,
          });

          // Upsert de gêneros
          const genres = series.genres || [];
          for (const genre of genres) {
            await Genre.upsert({
              id: genre.id,
              name: genre.name,
            });
            await series.addGenre(genre.id);
          }

          // Upsert de empresas de produção
          const productionCompanies = series.production_companies || [];
          for (const production of productionCompanies) {
            const [productionCompany] = await ProductionCompany.upsert({
              tmdb_id: production.id,
              name: production.name,
              logo_path: production.logo_path,
              origin_country: production.origin_country,
            });

            await SeriesProductionCompanies.upsert({
              series_tmdb_id: series.id,
              production_company_id: productionCompany.tmdb_id,
            });
          }

          // Verificar se a temporada existe
          let season = await Season.findOne({
            where: { series_tmdb_id: series.id, season_number },
          });

          if (!season) {
            // Buscar detalhes da temporada se não encontrado
            const seasonResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
            );
            const seasonData = seasonResponse.data;

            // Criar a temporada no banco de dados
            season = await Season.create({
              series_tmdb_id: series.id,
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

          // Criar o link do vídeo
          const videoLink = `https://vidhideplus.com/file/${file_code}`;

          // Criar o episódio no banco de dados
          const episode = await Episode.create({
            name: title,
            overview: '', // Você pode buscar uma sinopse se necessário
            season_id: season.id,
            episode_number,
            link: videoLink,
          });

          console.log(`Saved episode: ${episode.name}`);

          // Incrementar o número de arquivos processados
          processedFiles++;
          console.log(`Processed ${processedFiles} of ${totalFiles} files.`);
        } catch (error) {
          console.error(`Error processing series ${seriesName}:`, error.message);
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
