const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.db'),
  logging: false, 
  define: {
    timestamps: true,
    underscored: false,
  }
});

const User = require('./User')(sequelize);
const Admin = require('./Admin')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Cart = require('./Cart')(sequelize);
const Review = require('./Review')(sequelize);


// Categoria -> Produtos (1:N)
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Usuário -> Pedidos (1:N)
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Pedido -> Itens do Pedido (1:N)
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Produto -> Itens do Pedido (1:N)
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Usuário -> Carrinho (1:N)
User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Produto -> Carrinho (1:N)
Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Pedido -> Avaliações (1:1)
Order.hasOne(Review, { foreignKey: 'orderId', onDelete: 'CASCADE' });
Review.belongsTo(Order, { foreignKey: 'orderId' });

// Usuário -> Avaliações (1:N)
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexão com SQLite estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('✗ Erro ao conectar com o banco de dados:', error);
    return false;
  }
}

async function syncDatabase(force = false) {
  try {
    await sequelize.sync({ force }); 
    console.log('✓ Banco de dados sincronizado.');
  } catch (error) {
    console.error('✗ Erro ao sincronizar banco de dados:', error);
  }
}

module.exports = {
  sequelize,
  User,
  Admin,
  Category,
  Product,
  Order,
  OrderItem,
  Cart,
  Review,
  testConnection,
  syncDatabase
};