const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Rotas de filme
router.post('/add', movieController.addMovie);
router.post('/import', movieController.importMoviesFromFilemoon); // Nova rota para importar filmes
router.get('/', movieController.getMovies); // Obter todos os filmes
router.get('/:id', movieController.getMovieById); // Obter detalhes do filme por ID

// Rotas adicionais
router.get('/:id/cast', movieController.getMovieCast); // Obter elenco do filme por ID
router.get('/:id/recommendations', movieController.getMovieRecommendations); // Nova rota para recomendações

module.exports = router;
