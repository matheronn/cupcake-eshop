const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.db'), // Arquivo SQLite na raiz do projeto
  logging: process.env.NODE_ENV === 'development' ? console.log : false, 
  define: {
    timestamps: true,
    underscored: false, 
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com SQLite estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

module.exports = {
  sequelize,
  testConnection
};