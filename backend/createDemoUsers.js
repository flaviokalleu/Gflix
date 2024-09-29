const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    // Criar ou encontrar os papéis
    const [userRole, adminRole] = await Promise.all([
      Role.findOrCreate({
        where: { name: 'user' },
        defaults: { name: 'user' }
      }),
      Role.findOrCreate({
        where: { name: 'admin' },
        defaults: { name: 'admin' }
      })
    ]);

    // Criptografar as senhas
    const userPassword = await bcrypt.hash('user', 10);
    const adminPassword = await bcrypt.hash('admin', 10);

    // Criar o usuário de demonstração
    const demoUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userPassword
    });

    // Criar o administrador
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: adminPassword
    });

    // Associar os papéis aos usuários
    await Promise.all([
      demoUser.addRole(userRole[0]), // Associa o papel 'user' ao demoUser
      adminUser.addRole(adminRole[0]) // Associa o papel 'admin' ao adminUser
    ]);

    console.log('Usuários de demonstração criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuários de demonstração:', error);
  }
})();
