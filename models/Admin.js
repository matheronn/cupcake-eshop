const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome é obrigatório' }
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
        notEmpty: { msg: 'Senha é obrigatória' }
      }
    },
    tipo: {
      type: DataTypes.ENUM('principal', 'secundario'),
      defaultValue: 'secundario'
    },
    ultimoAcesso: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'administradores',
    timestamps: true,
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.senha) {
          const salt = await bcrypt.genSalt(10);
          admin.senha = await bcrypt.hash(admin.senha, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          admin.senha = await bcrypt.hash(admin.senha, salt);
        }
      }
    }
  });

  Admin.prototype.verificarSenha = async function(senhaFornecida) {
    return await bcrypt.compare(senhaFornecida, this.senha);
  };

  Admin.prototype.atualizarAcesso = async function() {
    this.ultimoAcesso = new Date();
    await this.save();
  };

  return Admin;
};