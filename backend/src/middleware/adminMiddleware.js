const { User, Role } = require('../models');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [Role]
    });

    if (!user || !user.Roles.some(role => role.name === 'admin')) {
      return res.status(403).json({ message: 'Acesso negado. Você não é administrador.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = isAdmin;
