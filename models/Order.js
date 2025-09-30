const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
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
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'em_preparo', 'enviado', 'entregue', 'cancelado'),
      defaultValue: 'pendente'
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Valor total não pode ser negativo' }
      }
    },
    formaPagamento: {
      type: DataTypes.ENUM('cartao_credito', 'cartao_debito', 'pix'),
      allowNull: false
    },
    enderecoEntrega: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dataEntregaPrevista: {
      type: DataTypes.DATE,
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pedidos',
    timestamps: true
  });

  Order.prototype.atualizarStatus = async function(novoStatus) {
    const statusValidos = ['pendente', 'confirmado', 'em_preparo', 'enviado', 'entregue', 'cancelado'];
    
    if (!statusValidos.includes(novoStatus)) {
      throw new Error('Status inválido');
    }
    
    this.status = novoStatus;
    
    if (novoStatus === 'entregue' && !this.dataEntregaPrevista) {
      this.dataEntregaPrevista = new Date();
    }
    
    await this.save();
  };

  Order.prototype.tempoParaEntrega = function() {
    if (!this.dataEntregaPrevista) return null;
    
    const agora = new Date();
    const diff = this.dataEntregaPrevista - agora;
    
    if (diff < 0) return 'Entrega atrasada';
    
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}min`;
  };

  Order.prototype.podeSerAvaliado = function() {
    return this.status === 'entregue';
  };

  return Order;
};