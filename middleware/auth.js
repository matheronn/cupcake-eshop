function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login?error=' + encodeURIComponent('Você precisa fazer login primeiro'));
}

function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(403).render('403', { 
    title: 'Acesso Negado',
    message: 'Você não tem permissão para acessar esta área' 
  });
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  isAuthenticated,
  isAdmin,
  redirectIfAuthenticated
};