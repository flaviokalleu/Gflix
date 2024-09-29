const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Movie, Keyword, Genre, Cast, Director, Network } = require('../models');

router.post('/movie', async (req, res) => {
  const { movieId } = req.body;

  try {
    // Requisita dados do filme da API do TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,keywords,credits,production_companies`);
    const movie = response.data;

    // Verifica se o filme já existe no banco de dados
    const existingMovie = await Movie.findOne({ where: { tmdb_id: movie.id } });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists in the database.' });
    }

    // Adiciona o filme ao banco de dados
    const newMovie = await Movie.create({
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      trailer_url: movie.videos.results.length > 0 ? `https://www.youtube.com/watch?v=${movie.videos.results[0].key}` : null
    });

    // Função para garantir a existência de gêneros
    const ensureGenresExist = async (genres) => {
      const existingGenres = await Genre.findAll({
        where: { tmdb_id: genres.map(genre => genre.id) }
      });

      const existingGenreIds = new Set(existingGenres.map(genre => genre.tmdb_id));
      const newGenres = genres.filter(genre => !existingGenreIds.has(genre.id));

      // Cria novos gêneros se necessário
      const createdGenres = await Promise.all(
        newGenres.map(async (genre) => {
          const [newGenre] = await Genre.findOrCreate({
            where: { tmdb_id: genre.id },
            defaults: { name: genre.name }
          });
          return newGenre.id;
        })
      );

      // Retorna todos os IDs de gêneros para associar
      return [...existingGenres.map(genre => genre.id), ...createdGenres];
    };

    // Gêneros
    if (movie.genres && movie.genres.length > 0) {
      const allGenreIds = await ensureGenresExist(movie.genres);
      await newMovie.addGenres(allGenreIds);
    }

    // Palavras-chave
    if (movie.keywords && movie.keywords.keywords && movie.keywords.keywords.length > 0) {
      const keywordIds = await Promise.all(
        movie.keywords.keywords.map(async (keyword) => {
          const [keywordInstance] = await Keyword.findOrCreate({
            where: { name: keyword.name },
            defaults: { name: keyword.name }
          });
          return keywordInstance.id;
        })
      );
      await newMovie.addKeywords(keywordIds);
    }

    // Elenco
    if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
      const castIds = await Promise.all(
        movie.credits.cast.map(async (castMember) => {
          const [castInstance] = await Cast.findOrCreate({
            where: { tmdb_id: castMember.id },
            defaults: { 
              name: castMember.name, 
              character: castMember.character,
              profile_path: castMember.profile_path
            }
          });
          return castInstance.id;
        })
      );
      await newMovie.addCasts(castIds);
    }

    // Diretores
    if (movie.credits && movie.credits.crew) {
      const directorIds = await Promise.all(
        movie.credits.crew
          .filter(crewMember => crewMember.job === 'Director')
          .map(async (director) => {
            const [directorInstance] = await Director.findOrCreate({
              where: { tmdb_director_id: director.id }, // Atualizado para tmdb_director_id
              defaults: { 
                name: director.name,
                profile_path: director.profile_path // Adiciona a foto do diretor
              }
            });
            return directorInstance.id;
          })
      );
      await newMovie.addDirectors(directorIds);
    }
    

    // Redes
    if (movie.networks) {
      const networkIds = await Promise.all(
        movie.networks.map(async (network) => {
          const [networkInstance] = await Network.findOrCreate({
            where: { tmdb_network_id: network.id }, // Atualizado para tmdb_network_id
            defaults: { 
              name: network.name,
              logo_path: network.logo_path // Adiciona o logo da rede
            }
          });
          return networkInstance.id;
        })
      );
      await newMovie.addNetworks(networkIds);
    }
    

    res.status(200).json({ message: 'Movie imported successfully!' });
  } catch (error) {
    console.error('Error importing movie:', error);
    res.status(500).json({ message: 'Failed to import movie.' });
  }
});

module.exports = router;
