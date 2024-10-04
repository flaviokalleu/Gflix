const express = require("express");
const { User, Role, Movie, Series, Season, Episode } = require('../models'); // Ajuste o caminho conforme necessário


const router = express.Router();

// Rota para obter todos os usuários
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll(); // Obtendo todos os usuários sem incluir a associação de papéis
    res.status(200).json(users); // Retorna os usuários com status 200
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Rota para obter estatísticas
// Rota para obter estatísticas
router.get("/statistics", async (req, res) => {
  try {
    // Conta o total de usuários
    const totalUsers = await User.count();

    // Conta o total de administradores
    const totalAdmins = await User.count({
      include: {
        model: Role,
        as: 'Roles', // Use o mesmo alias aqui
        where: { name: 'admin' }
      }
    });

    // Conta o total de usuários normais
    const totalRegularUsers = await User.count({
      include: {
        model: Role,
        as: 'Roles', // Use o mesmo alias aqui
        where: { name: 'user' }
      }
    });

    // Conta o total de filmes
    const totalMovies = await Movie.count();

    // Conta o total de séries
    const totalSeries = await Series.count();

    // Conta o total de temporadas
    const totalSeasons = await Season.count();

    // Conta o total de episódios
    const totalEpisodes = await Episode.count();

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      totalMovies,
      totalSeries,
      totalSeasons,
      totalEpisodes,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
});

// Rota para remover um usuário
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId); // Busca o usuário pelo ID
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy(); // Remove o usuário
    res.status(200).json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
});

module.exports = router;
