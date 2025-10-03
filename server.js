const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
// const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'cupcake-ecommerce-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

app.get('/', async (req, res) => {
  try {
    const products = await db.Product.findAll({
      where: { ativo: true },
      limit: 8,
      order: [['createdAt', 'DESC']],
      include: [{ model: db.Category, as: 'Category' }]
    });
    res.render('index', { 
      title: 'Cupcakes E-shop',
      products
    });
  } catch (error) {
    console.error('Erro ao carregar página inicial:', error);
    res.render('index', { 
      title: 'Cupcakes E-shop',
      products: [] 
    });
  }
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
// app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  res.status(500).render('500', { 
    title: 'Erro interno',
    error: process.env.NODE_ENV === 'development' ? error : null
  });
});

async function startServer() {
  try {
    await db.testConnection();
    
    await db.syncDatabase();
    
    console.log('Iniciando servidor...');
    
    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ Acesse: http://localhost:${PORT}`);
      console.log('Pressione Ctrl+C para parar o servidor');
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

startServer();

module.exports = app;