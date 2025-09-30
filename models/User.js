const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome é obrigatório' },
        len: { args: [3, 100], msg: 'Nome deve ter entre 3 e 100 caracteres' }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Este e-mail já está cadastrado'
      },
      validate: {
        isEmail: { msg: 'E-mail inválido' },
        notEmpty: { msg: 'E-mail é obrigatório' }
      }
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Senha é obrigatória' },
        len: { args: [8, 255], msg: 'Senha deve ter no mínimo 8 caracteres' }
      }
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo', 'bloqueado'),
      defaultValue: 'ativo'
    },
    tentativasLogin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bloqueadoAte: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.senha) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      }
    }
  });

  User.prototype.verificarSenha = async function(senhaFornecida) {
    return await bcrypt.compare(senhaFornecida, this.senha);
  };

  User.prototype.incrementarTentativas = async function() {
    this.tentativasLogin += 1;
    
    if (this.tentativasLogin >= 5) {
      this.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000); 
      this.status = 'bloqueado';
    }
    
    await this.save();
  };

  User.prototype.resetarTentativas = async function() {
    this.tentativasLogin = 0;
    this.bloqueadoAte = null;
    if (this.status === 'bloqueado') {
      this.status = 'ativo';
    }
    await this.save();
  };

  User.prototype.estaBloqueado = function() {
    if (this.status === 'bloqueado' && this.bloqueadoAte) {
      if (new Date() > this.bloqueadoAte) {
        // Desbloqueio automático
        this.resetarTentativas();
        return false;
      }
      return true;
    }
    return false;
  };

  return User;
};