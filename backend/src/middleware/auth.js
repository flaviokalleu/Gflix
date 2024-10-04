// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Espera-se que o token venha no formato "Bearer token"
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, token ausente.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Adiciona o usuário verificado ao objeto req
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' }); // Retorna 403 para token inválido
  }
};

module.exports = authenticateToken;
