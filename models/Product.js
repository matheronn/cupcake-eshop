const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome do produto é obrigatório' }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Preço deve ser um número válido' },
        min: { args: [0.01], msg: 'Preço deve ser maior que zero' }
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    ingredientes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagemUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/images/cupcake-default.jpg'
    },
    estoque: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Estoque não pode ser negativo' }
      }
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'produtos',
    timestamps: true
  });

  Product.prototype.estaDisponivel = function() {
    return this.ativo && this.estoque > 0;
  };

  Product.prototype.reduzirEstoque = async function(quantidade) {
    if (this.estoque < quantidade) {
      throw new Error('Estoque insuficiente');
    }
    this.estoque -= quantidade;
    await this.save();
  };

  Product.prototype.aumentarEstoque = async function(quantidade) {
    this.estoque += quantidade;
    await this.save();
  };

  return Product;
};