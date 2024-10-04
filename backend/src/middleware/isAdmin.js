const { User, Role } = require('../models');

const isAdmin = async (req, res, next) => {
  try {
    // Obtenha o ID do usuário a partir do token ou contexto (ajuste conforme necessário)
    const userId = req.userId; // Certifique-se de que `req.userId` esteja definido corretamente

    // Busca o usuário e suas roles, usando o alias definido
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'Roles' }], // Incluindo as roles associadas ao usuário usando o alias
    });

    // Verifica se o usuário existe
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o usuário possui roles e se uma delas é 'admin'
    const isUserAdmin = user.Roles && user.Roles.some(role => role.name === 'admin');

    if (!isUserAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Você não é administrador.' });
    }

    next(); // Chama o próximo middleware se o usuário for um admin
  } catch (error) {
    console.error("Erro ao verificar a role do usuário:", error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = isAdmin;
