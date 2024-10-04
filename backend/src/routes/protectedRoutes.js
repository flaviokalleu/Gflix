// routes/protectedRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/auth'); // Ajuste o caminho conforme necessário
const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso permitido.', user: req.user });
});

module.exports = router;
