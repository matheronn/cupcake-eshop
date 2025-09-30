const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        msg: 'Este pedido já foi avaliado'
      },
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Nota mínima é 1 estrela' },
        max: { args: [5], msg: 'Nota máxima é 5 estrelas' }
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'avaliacoes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['orderId', 'userId']
      }
    ]
  });

  return Review;
};