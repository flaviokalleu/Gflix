const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Role } = require('../models'); // Adicione Role aqui
// Função para registro de usuário
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Usuário já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
  } catch (err) {
    console.error('Erro ao registrar o usuário:', err);
    res.status(500).json({ error: 'Erro ao registrar o usuário.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe, incluindo a associação de papéis
    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        as: 'Roles', // Use o alias definido no modelo User
        through: { attributes: [] } // Ignorar a tabela de junção, se não precisar de informações dela
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha enviada com a senha armazenada (hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    // Pega o nome do papel (ou os papéis) do usuário
    const roles = await user.getRoles(); // Supondo que você tenha um método para pegar os papéis
    const roleNames = roles.map(role => role.name); // Obtendo os nomes dos papéis

    // Gera o token JWT, contendo o id, o username e a role do usuário
    const token = jwt.sign(
      { id: user.id, username: user.username, roles: roleNames },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    // Retorna o token gerado, a role e uma mensagem de sucesso
    return res.status(200).json({ message: 'Login bem-sucedido!', token, roles: roleNames });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ error: 'Erro ao fazer login. Tente novamente mais tarde.' });
  }
};




exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário retirado do token
    const user = await User.findByPk(userId, {
      include: {
        model: Role, // Inclui o modelo Role
        as: 'Roles', // Especifica o alias usado na associação
        through: { attributes: [] } // Ignorar a tabela de junção, se não precisar de informações dela
      }
    }); // Buscando o usuário pelo ID e incluindo papéis

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Pega os nomes dos papéis do usuário
    const roleNames = user.Roles.map(role => role.name); // Obtendo os nomes dos papéis diretamente da propriedade `Roles`

    // Retornar apenas as informações desejadas, incluindo a role
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roleNames // Inclui os papéis do usuário na resposta
    });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error); // Log do erro
    res.status(500).json({ message: 'Erro ao buscar informações do usuário.' });
  }
};



// Função para obter os filmes/séries favoritos do usuário
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário retirado do token
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Movie }] // Inclua o modelo correto de filme/série
    });

    res.json(favorites);
  } catch (error) {
    console.error('Erro ao buscar filmes/séries favoritas:', error); // Log do erro
    res.status(500).json({ message: 'Erro ao buscar filmes/séries favoritas.' });
  }
};

