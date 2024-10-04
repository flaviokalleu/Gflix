const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const importRoutes = require('./routes/importRoutes'); // Importa as rotas de importação
const seriesRoutes = require('./routes/seriesRoutes');

const adminRoutes = require("./routes/adminRoutes"); 
const protectedRoutes = require('./routes/protectedRoutes'); // Ajuste o caminho conforme necessário

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/series', seriesRoutes);

app.use('/api/movies', movieRoutes);
app.use('/import', importRoutes); // Configura as rotas de importação
app.use('/api', protectedRoutes); // Isso significa que sua rota protegida estará disponível em /api/protected

(async () => {
  try {
      // Sync the database
      await sequelize.sync({ force: true });
      console.log('Database synchronized successfully.');

      // Start the server
      app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      });
  } catch (error) {
      console.error('Error synchronizing the database:', error);
  }
})();

// Conectar ao banco de dados
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados com sucesso.'))
  .catch(err => console.error('Não foi possível conectar ao banco de dados:', err));
