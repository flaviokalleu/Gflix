const axios = require('axios');
const { Movie, Cast, Genre, Keyword, Director, Network } = require('../models');

// Adicionar um novo filme
const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error('Erro ao adicionar o filme:', error);
    res.status(500).json({ message: 'Erro ao adicionar o filme' });
  }
};
const getMovieRecommendations = async (req, res) => {
  const { id } = req.params;

  try {
    // Obter o filme atual pelo ID
    const currentMovie = await Movie.findById(id).populate('genres'); // Assumindo que 'genres' é um campo populável

    if (!currentMovie) {
      return res.status(404).json({ message: 'Filme não encontrado.' });
    }

    // Extrair os gêneros do filme atual
    const genreIds = currentMovie.genres.map(genre => genre._id);

    // Buscar filmes que compartilham os mesmos gêneros, excluindo o filme atual
    const recommendations = await Movie.find({
      genres: { $in: genreIds },
      _id: { $ne: id }
    }).limit(5); // Limitar a 5 recomendações

    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching movie recommendations:', err);
    res.status(500).json({ message: 'Erro ao obter recomendações.' });
  }
};

// Obter todos os filmes
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      include: [{ model: Genre, as: 'genres' }] // Incluir gêneros
    });
    return res.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return res.status(500).json({ message: 'Falha ao buscar filmes.' });
  }
};

// Obter filme por ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{ model: Genre, as: 'genres' }, { model: Cast, as: 'casts' }] // Incluir gêneros e elenco
    });
    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error('Erro ao obter o filme:', error);
    res.status(500).json({ message: 'Erro ao obter o filme' });
  }
};

// Obter recomendações de filmes (implementação futura)
const getRecommendedMovies = async (req, res) => {
  // Implementar lógica para obter recomendações
};

// Obter elenco do filme por ID
const getMovieCast = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: {
        model: Cast,
        as: 'casts', // Alias definido na associação do modelo `Movie`
        through: { attributes: [] }
      }
    });

    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.status(200).json(movie.casts);
  } catch (error) {
    console.error('Erro ao obter o elenco do filme:', error);
    res.status(500).json({ message: 'Erro ao obter o elenco do filme' });
  }
};

// Importar filmes do Filemoon
const importMoviesFromFilemoon = async (req, res) => {
  try {
    // Busca os filmes da API do Filemoon
    const filemoonResponse = await axios.get('https://filemoonapi.com/api/file/list?key=32432nh97do6cze51lwrb&fld_id=213947');
    const moviesFromFilemoon = filemoonResponse.data.result.files;

    // Processa cada filme do Filemoon
    for (const filemoonMovie of moviesFromFilemoon) {
      const tmdbMovieId = filemoonMovie.title; // Ajustar para buscar o tmdb_id correto se necessário

      if (!tmdbMovieId) {
        console.error('ID TMDB não encontrado para o filme.', filemoonMovie);
        continue;
      }

      // Busca detalhes do filme na API do TMDB em português
      const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&append_to_response=videos,keywords,credits,production_companies,networks`);
      const movie = movieResponse.data;

      const existingMovie = await Movie.findOne({ where: { tmdb_id: movie.id } });
      if (existingMovie) {
        console.log(`O filme ${movie.title} já existe no banco de dados.`);
        continue;
      }

      // Obtém o link do player usando o código do arquivo do Filemoon
      const playerLink = filemoonMovie.file_code ? `https://filemoon.sx/e/${filemoonMovie.file_code}` : null;

      // Prepara os dados do novo filme para inserção
      const newMovieData = {
        tmdb_id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        trailer_url: movie.videos.results.length > 0 ? `https://www.youtube.com/watch?v=${movie.videos.results[0].key}` : null,
        player_links: playerLink
      };

      const newMovie = await Movie.create(newMovieData);

      // Função para garantir que os gêneros existam
      const ensureGenresExist = async (genres) => {
        const existingGenres = await Genre.findAll({
          where: { tmdb_id: genres.map(genre => genre.id) }
        });

        const existingGenreIds = new Set(existingGenres.map(genre => genre.tmdb_id));
        const newGenres = genres.filter(genre => !existingGenreIds.has(genre.id));

        const createdGenres = await Promise.all(
          newGenres.map(async (genre) => {
            const [newGenre] = await Genre.findOrCreate({
              where: { tmdb_id: genre.id },
              defaults: { name: genre.name }
            });
            return newGenre.id;
          })
        );

        return [...existingGenres.map(genre => genre.id), ...createdGenres];
      };

      // Manipulação dos gêneros
      if (movie.genres && movie.genres.length > 0) {
        const allGenreIds = await ensureGenresExist(movie.genres);
        await newMovie.addGenres(allGenreIds);
      }

      // Manipulação das palavras-chave
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

      // Manipulação dos diretores
      if (movie.credits && movie.credits.crew) {
        const directorIds = await Promise.all(
          movie.credits.crew
            .filter(crewMember => crewMember.job === 'Director')
            .map(async (director) => {
              const [directorInstance] = await Director.findOrCreate({
                where: { tmdb_director_id: director.id },
                defaults: { 
                  name: director.name,
                  profile_path: director.profile_path
                }
              });
              return directorInstance.id;
            })
        );
        await newMovie.addDirectors(directorIds);
      }

      // Manipulação do elenco
      if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        const castIds = [];
    
        for (const castMember of movie.credits.cast) {
            try {
                const [castInstance, created] = await Cast.findOrCreate({
                    where: { tmdb_id: castMember.id },
                    defaults: {
                        name: castMember.name,
                        tmdb_cast_id: castMember.id,
                        profile_path: castMember.profile_path || null,
                        character_name: castMember.character || null, // Ajuste conforme a estrutura do objeto
                    }
                });
    
                console.log(`Membro do elenco: ${castMember.name}, ID: ${castInstance.id}, Criado: ${created}`);
    
                castIds.push(castInstance.id);
            } catch (err) {
                console.error(`Erro ao processar o elenco ${castMember.name}:`, err);
            }
        }
    
        if (castIds.length > 0) {
            console.log(`Associando os IDs do elenco ao filme: ${castIds}`);
            await newMovie.addCasts(castIds);
        } else {
            console.error(`Nenhum membro do elenco foi encontrado para o filme: ${movie.title}`);
        }
    }
    
    }

    res.status(200).json({ message: 'Filmes importados com sucesso!' });
  } catch (error) {
    console.error('Erro ao importar filmes:', error);
    res.status(500).json({ message: 'Falha ao importar filmes.' });
  }
};


// Função auxiliar para buscar ID do filme pelo título
const fetchMovieIdByTitle = async (tmdb_id) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdb_id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      }
    });
    return response.data ? response.data.id : null;
  } catch (error) {
    console.error(`Erro ao buscar ID do filme: ${error}`);
    return null;
  }
};

module.exports = {
  addMovie,
  getMovies,
  getMovieById,
  getRecommendedMovies,
  getMovieCast,
  importMoviesFromFilemoon,
  fetchMovieIdByTitle,
  getMovieRecommendations, // Exporte a nova função

};
