const express = require('express');
const router = express.Router();
const SeriesController = require('../controllers/SeriesController');
const SeriesFileController = require('../controllers/SeriesFileController');
const { Series, Season, Episode, Genre, ProductionCompany, Cast, SeriesCast } = require('../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

// Função para buscar séries aleatórias
const getRandomSeries = async (req, res) => {
    try {
        const { excludeId } = req.query;

        const series = await Series.findAll({
            where: {
                tmdb_id: {
                    [Op.ne]: null // Garante que apenas registros com um tmdb_id válido sejam buscados
                },
                ...(excludeId && { tmdb_id: { [Op.ne]: excludeId } })
            },
            order: Sequelize.literal('RAND()'),
            limit: 4,
        });

        if (!series || series.length === 0) {
            return res.status(404).json({ error: 'Nenhuma série encontrada.' });
        }

        res.status(200).json(series);
    } catch (error) {
        console.error('Erro ao buscar séries aleatórias:', error);
        res.status(500).json({ error: 'Erro ao buscar séries aleatórias.' });
    }
};

// Rota para buscar episódios recentes
router.get('/recent-episodes', async (req, res) => {
    try {
        const episodes = await Episode.findAll({
            order: [['air_date', 'DESC']],
            limit: 10,
            include: [{ model: Season, as: 'season', include: [{ model: Series, as: 'series' }] }]
        });

        if (!episodes.length) {
            return res.status(404).json({ error: 'Nenhum episódio encontrado.' });
        }

        const formattedEpisodes = episodes.map(episode => {
            const airDate = new Date(episode.air_date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = airDate.toLocaleDateString('pt-BR', options);

            return {
                ...episode.toJSON(),
                air_date: formattedDate
            };
        });

        res.json(formattedEpisodes);
    } catch (error) {
        console.error('Erro ao buscar episódios recentes:', error);
        res.status(500).json({ error: 'Erro ao buscar episódios recentes.' });
    }
});

// Rotas para as séries
router.get('/', SeriesController.list);
router.post('/', SeriesController.create);
router.get('/:tmdb_id', SeriesController.getById);
router.put('/:tmdb_id', SeriesController.update);
router.delete('/:tmdb_id', SeriesController.delete);
router.get('/recommendations/random', getRandomSeries);
router.post('/fetch-and-save-files', SeriesFileController.fetchAndSaveSeriesFiles);


// Rota para buscar uma série pelo tmdb_id
router.get('/tmdb/:tmdb_id', async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
        return res.status(400).json({ error: 'tmdb_id não fornecido.' });
    }

    try {
        const series = await Series.findOne({
            where: { tmdb_id },
            include: [
                { model: Genre, as: 'genres' },
                { model: ProductionCompany, as: 'production_companies' },
                { model: Cast, as: 'casts' },
            ]
        });
        if (!series) {
            return res.status(404).json({ error: 'Série não encontrada.' });
        }
        res.json(series);
    } catch (error) {
        console.error('Erro ao buscar série:', error);
        res.status(500).json({ error: 'Erro ao buscar série' });
    }
});

// Rota para buscar temporadas de uma série
router.get('/seasons/:tmdb_id', async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
        return res.status(400).json({ error: 'tmdb_id não fornecido.' });
    }

    try {
        const seasons = await Season.findAll({ where: { series_tmdb_id: tmdb_id } });
        if (!seasons.length) {
            return res.status(404).json({ error: 'Temporadas não encontradas para este tmdb_id.' });
        }
        res.json(seasons);
    } catch (error) {
        console.error('Erro ao buscar temporadas:', error);
        res.status(500).json({ error: 'Erro ao buscar temporadas' });
    }
});

// Rota para buscar episódios de uma temporada
router.get('/tmdb/:tmdb_id/episodes', async (req, res) => {
    const { tmdb_id } = req.params;

    try {
        const seasons = await Season.findAll({ where: { series_tmdb_id: tmdb_id } });

        if (!seasons.length) {
            return res.status(404).json({ error: 'Temporadas não encontradas para este tmdb_id.' });
        }

        const episodesPromises = seasons.map(season => {
            return Episode.findAll({ where: { season_id: season.id } });
        });

        const episodesArrays = await Promise.all(episodesPromises);
        const episodes = episodesArrays.flat();

        if (!episodes.length) {
            return res.status(404).json({ error: 'Episódios não encontrados para este tmdb_id.' });
        }

        res.json(episodes);
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
        res.status(500).json({ error: 'Erro ao buscar episódios' });
    }
});

// Rota para buscar o elenco de uma série
router.get('/tmdb/:tmdb_id/cast', async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
        return res.status(400).json({ error: 'tmdb_id não fornecido.' });
    }

    try {
        const series = await Series.findOne({
            where: { tmdb_id },
            include: [
                { model: Genre, as: 'genres' },
                { model: ProductionCompany, as: 'production_companies' },
                {
                    model: SeriesCast,
                    as: 'cast',
                    include: [
                        {
                            model: Cast,
                            as: 'cast',
                            attributes: ['tmdb_id', 'name', 'profile_path', 'character_name'],
                        },
                    ],
                }
            ],
        });

        if (!series) {
            return res.status(404).json({ error: 'Série não encontrada.' });
        }

        if (!series.cast || series.cast.length === 0) {
            return res.status(404).json({ 
                error: 'Elenco não encontrado para esta série.',
                series: {
                    tmdb_id: series.tmdb_id,
                    name: series.name,
                    overview: series.overview,
                }
            });
        }

        const castData = series.cast.map(actor => ({
            tmdb_id: actor.cast.tmdb_id,
            name: actor.cast.name,
            profile_path: actor.cast.profile_path,
            character_name: actor.character_name,
        }));

        res.json(castData);
    } catch (error) {
        console.error('Erro ao buscar elenco:', error);
        res.status(500).json({ error: 'Erro ao buscar elenco' });
    }
});

// Rota para buscar gêneros
router.get('/api/genres', async (req, res) => {
    try {
        const genres = await Genre.findAll({
            include: [{
                model: Series,
                as: 'series',
                attributes: ['tmdb_id', 'name'],
            }],
        });
        res.json(genres);
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para buscar um episódio específico pelo ID
router.get('/episodes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const episode = await Episode.findOne({
            where: { id },
            include: [{ model: Season, as: 'season', include: [{ model: Series, as: 'series' }] }]
        });

        if (!episode) {
            return res.status(404).json({ error: 'Episódio não encontrado.' });
        }

        res.json(episode);
    } catch (error) {
        console.error('Erro ao buscar episódio:', error);
        res.status(500).json({ error: 'Erro ao buscar episódio.' });
    }
});

module.exports = router;
