const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: 'Quantidade deve ser no mínimo 1' }
      }
    }
  }, {
    tableName: 'carrinho',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId']
      }
    ]
  });

  Cart.prototype.atualizarQuantidade = async function(novaQuantidade) {
    if (novaQuantidade < 1) {
      throw new Error('Quantidade deve ser no mínimo 1');
    }
    this.quantidade = novaQuantidade;
    await this.save();
  };

  return Cart;
};