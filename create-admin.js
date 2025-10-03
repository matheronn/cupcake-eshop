const { Admin } = require('./models');

async function createAdmin() {
  try {
    const admin = await Admin.create({
      nome: 'Admin',
      email: 'admin@email.com',
      senha: 'admin',
      tipo: 'principal'
    });
    console.log('Admin criado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

createAdmin();