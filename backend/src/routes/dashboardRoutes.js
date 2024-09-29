const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');

router.get('/dashboard', isAdmin, (req, res) => {
  res.send('Bem-vindo ao Dashboard do Administrador');
});

router.get('/dashboard/filmes/adicionar', isAdmin, (req, res) => {
  res.send('Página para adicionar filmes');
});

module.exports = router;
