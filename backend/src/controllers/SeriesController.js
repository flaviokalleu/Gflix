const { Series, Episode, Season, sequelize } = require('../models'); // Adicione sequelize aqui


const axios = require('axios');

const SeriesController = {
  // Listar todas as séries
  async list(req, res) {
    try {
      const series = await Series.findAll();
      res.status(200).json(series);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar séries' });
    }
  },

  // Criar uma nova série
  async create(req, res) {
    const { tmdb_id } = req.body;

    if (!tmdb_id) {
      return res.status(400).json({ error: 'tmdb_id é necessário' });
    }

    try {
      // Busca informações da série no TMDB
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
      );
      const seriesData = response.data;

      // Cria nova série no banco de dados
      const newSeries = await Series.create({
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

      res.status(201).json(newSeries);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Série não encontrada no TMDB' });
      }
      res.status(500).json({ error: 'Erro ao criar série' });
    }
  },

  // Obter série por tmdb_id
  async getById(req, res) {
    const { id } = req.params;
    try {
      const series = await Series.findOne({ where: { tmdb_id: id } });
      if (!series) {
        return res.status(404).json({ error: 'Série não encontrada' });
      }
      res.status(200).json(series);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter série' });
    }
  },

  // Atualizar uma série
async update(req, res) {
  const { tmdb_id } = req.params; // Certifique-se de que está capturando o tmdb_id corretamente
  try {
    const [updated] = await Series.update(req.body, {
      where: { tmdb_id: tmdb_id }, // Use tmdb_id aqui
    });
    if (!updated) {
      return res.status(404).json({ error: 'Série não encontrada' });
    }
    const updatedSeries = await Series.findOne({ where: { tmdb_id: tmdb_id } });
    res.status(200).json(updatedSeries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar série' });
  }
},


async delete(req, res) {
  const { tmdb_id } = req.params; // Certifique-se de capturar o tmdb_id corretamente
  const transaction = await sequelize.transaction(); // Inicia uma transação
  try {
    // Primeiro, exclua os episódios relacionados
    const seasons = await Season.findAll({
      where: { series_tmdb_id: tmdb_id },
      transaction,
    });

    // Deletar episódios relacionados a cada temporada
    for (const season of seasons) {
      await Episode.destroy({
        where: { season_id: season.id },
        transaction,
      });
    }

    // Agora, exclua as temporadas
    await Season.destroy({
      where: { series_tmdb_id: tmdb_id },
      transaction,
    });

    // Em seguida, exclua a série
    const deleted = await Series.destroy({
      where: { tmdb_id: tmdb_id },
      transaction,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Série não encontrada' });
    }

    await transaction.commit(); // Comita a transação
    
    // Envia uma notificação de sucesso
    res.status(200).json({ message: 'Série deletada com sucesso!' });
  } catch (error) {
    await transaction.rollback(); // Reverte a transação em caso de erro
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar série' });
  }
},


};



module.exports = SeriesController;
