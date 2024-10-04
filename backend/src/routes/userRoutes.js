const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth'); // Importando o middleware

// Rota para registro de usuário
router.post('/register', userController.register);

// Rota para login de usuário
router.post('/login', userController.login);

// Rota para obter informações do usuário (com autenticação)
router.get('/profile', authenticateToken, userController.getUserProfile); // Adicione o middleware aqui

// Rota para obter as séries/filmes favoritos do usuário (com autenticação)
router.get('/favorites', authenticateToken, userController.getUserFavorites); // Adicione o middleware aqui

module.exports = router;
