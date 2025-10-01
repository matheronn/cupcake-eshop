const { User, Admin } = require('../models');
const { validationResult } = require('express-validator');

exports.showRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Cadastrar',
    error: req.query.error || null,
    success: req.query.success || null
  });
};

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, confirmarSenha, telefone } = req.body;
    
    if (!nome || !email || !senha || !confirmarSenha) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('Todos os campos são obrigatórios'));
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('E-mail inválido'));
    }
    
    if (senha.length < 8) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('Senha deve ter no mínimo 8 caracteres'));
    }
    
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!senhaRegex.test(senha)) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('Senha deve conter letras e números'));
    }
    
    if (senha !== confirmarSenha) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('As senhas não coincidem'));
    }
    
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('Este e-mail já está cadastrado'));
    }
    
    await User.create({
      nome,
      email: email.toLowerCase(),
      senha,
      telefone
    });
    
    res.redirect('/auth/login?success=' + encodeURIComponent('Cadastro realizado com sucesso! Faça login para continuar.'));
    
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.redirect('/auth/register?error=' + encodeURIComponent('Erro ao cadastrar. Tente novamente.'));
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    error: req.query.error || null,
    success: req.query.success || null
  });
};

exports.login = async (req, res) => {
  try {
    const { email, senha, tipoUsuario } = req.body;
    
    if (!email || !senha) {
      return res.redirect('/auth/login?error=' + encodeURIComponent('E-mail e senha são obrigatórios'));
    }
    
    let usuario;
    let isAdmin = false;
    
    if (tipoUsuario === 'admin') {
      usuario = await Admin.findOne({ where: { email: email.toLowerCase() } });
      isAdmin = true;
    } else {
      usuario = await User.findOne({ where: { email: email.toLowerCase() } });
    }
    
    if (!usuario) {
      return res.redirect('/auth/login?error=' + encodeURIComponent('E-mail ou senha incorretos'));
    }
    
    // Para usuários comuns, verificar se está bloqueado
    if (!isAdmin && usuario.estaBloqueado && usuario.estaBloqueado()) {
      const minutosRestantes = Math.ceil((new Date(usuario.bloqueadoAte) - new Date()) / 60000);
      return res.redirect('/auth/login?error=' + encodeURIComponent(`Conta bloqueada. Tente novamente em ${minutosRestantes} minutos.`));
    }
    
    const senhaValida = await usuario.verificarSenha(senha);
    
    if (!senhaValida) {
      if (!isAdmin && usuario.incrementarTentativas) {
        await usuario.incrementarTentativas();
        const tentativasRestantes = 5 - usuario.tentativasLogin;
        
        if (tentativasRestantes > 0) {
          return res.redirect('/auth/login?error=' + encodeURIComponent(`Senha incorreta. Você tem ${tentativasRestantes} tentativa(s) restante(s).`));
        } else {
          return res.redirect('/auth/login?error=' + encodeURIComponent('Conta bloqueada por 15 minutos devido a múltiplas tentativas falhas.'));
        }
      }
      return res.redirect('/auth/login?error=' + encodeURIComponent('E-mail ou senha incorretos'));
    }
    
    if (!isAdmin && usuario.resetarTentativas) {
      await usuario.resetarTentativas();
    }
    
    if (isAdmin && usuario.atualizarAcesso) {
      await usuario.atualizarAcesso();
    }
    
    req.session.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };
    req.session.isAdmin = isAdmin;
    
    const returnTo = req.session.returnTo || (isAdmin ? '/admin' : '/');
    delete req.session.returnTo;
    
    res.redirect(returnTo);
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.redirect('/auth/login?error=' + encodeURIComponent('Erro ao fazer login. Tente novamente.'));
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/');
  });
};