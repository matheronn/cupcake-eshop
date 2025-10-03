const { Product, Category, Order, User, OrderItem } = require('../models');
const path = require('path');
const multer = require('multer');

const upload = multer();

exports.dashboard = async (req, res) => {
  try {
    const totalProdutos = await Product.count();
    const totalPedidos = await Order.count();
    const totalClientes = await User.count();
    const pedidosPendentes = await Order.count({ where: { status: 'pendente' } });
    
    const pedidosRecentes = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['nome', 'email'] }]
    });
    
    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      stats: {
        totalProdutos,
        totalPedidos,
        totalClientes,
        pedidosPendentes
      },
      pedidosRecentes
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      stats: { totalProdutos: 0, totalPedidos: 0, totalClientes: 0, pedidosPendentes: 0 },
      pedidosRecentes: []
    });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }],
      order: [['createdAt', 'DESC']]
    });
    
    res.render('admin/products/list', {
      title: 'Gerenciar Produtos',
      products
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.render('admin/products/list', {
      title: 'Gerenciar Produtos',
      products: []
    });
  }
};

exports.showNewProduct = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { ativo: true } });
    res.render('admin/products/form', {
      title: 'Novo Produto',
      product: null,
      categories,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Erro ao carregar formulário:', error);
    res.redirect('/admin/products?error=' + encodeURIComponent('Erro ao carregar formulário'));
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nome, descricao, preco, categoryId, ingredientes, estoque } = req.body;
    
    if (!nome || !preco) {
      return res.redirect('/admin/products/new?error=' + encodeURIComponent('Nome e preço são obrigatórios'));
    }
    
    if (parseFloat(preco) <= 0) {
      return res.redirect('/admin/products/new?error=' + encodeURIComponent('Preço deve ser maior que zero'));
    }
    
    const productData = {
      nome,
      descricao,
      preco: parseFloat(preco),
      categoryId: categoryId || null,
      ingredientes,
      estoque: parseInt(estoque) || 0,
      ativo: true
    };
    
    // TODO: Upload de imagem será implementado depois
    
    await Product.create(productData);
    
    res.redirect('/admin/products?success=' + encodeURIComponent('Produto cadastrado com sucesso!'));
    
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.redirect('/admin/products/new?error=' + encodeURIComponent('Erro ao cadastrar produto'));
  }
};

exports.showEditProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    
    if (!product) {
      return res.redirect('/admin/products?error=' + encodeURIComponent('Produto não encontrado'));
    }
    
    const categories = await Category.findAll({ where: { ativo: true } });
    
    res.render('admin/products/form', {
      title: 'Editar Produto',
      product,
      categories,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    res.redirect('/admin/products?error=' + encodeURIComponent('Erro ao carregar produto'));
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.redirect('/admin/products?error=' + encodeURIComponent('Produto não encontrado'));
    }
    
    const { nome, descricao, preco, categoryId, ingredientes, estoque, ativo } = req.body;
    
    if (!nome || !preco) {
      return res.redirect(`/admin/products/edit/${req.params.id}?error=` + encodeURIComponent('Nome e preço são obrigatórios'));
    }
    
    if (parseFloat(preco) <= 0) {
      return res.redirect(`/admin/products/edit/${req.params.id}?error=` + encodeURIComponent('Preço deve ser maior que zero'));
    }
    
    await product.update({
      nome,
      descricao,
      preco: parseFloat(preco),
      categoryId: categoryId || null,
      ingredientes,
      estoque: parseInt(estoque) || 0,
      ativo: ativo === 'true' || ativo === true
    });
    
    res.redirect('/admin/products?success=' + encodeURIComponent('Produto atualizado com sucesso!'));
    
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.redirect(`/admin/products/edit/${req.params.id}?error=` + encodeURIComponent('Erro ao atualizar produto'));
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.redirect('/admin/products?error=' + encodeURIComponent('Produto não encontrado'));
    }
    
    const pedidosAtivos = await OrderItem.count({
      where: { productId: product.id },
      include: [{
        model: Order,
        where: { status: ['pendente', 'confirmado', 'em_preparo', 'enviado'] }
      }]
    });
    
    if (pedidosAtivos > 0) {
      return res.redirect('/admin/products?error=' + encodeURIComponent('Não é possível excluir. Produto tem pedidos ativos.'));
    }
    
    await product.destroy();
    
    res.redirect('/admin/products?success=' + encodeURIComponent('Produto removido com sucesso!'));
    
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.redirect('/admin/products?error=' + encodeURIComponent('Erro ao remover produto'));
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['nome', 'email'] },
        { model: OrderItem, include: [{ model: Product }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.render('admin/orders/list', {
      title: 'Gerenciar Pedidos',
      orders
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.render('admin/orders/list', {
      title: 'Gerenciar Pedidos',
      orders: []
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.redirect('/admin/orders?error=' + encodeURIComponent('Pedido não encontrado'));
    }
    
    const { status } = req.body;
    await order.atualizarStatus(status);
    
    res.redirect('/admin/orders?success=' + encodeURIComponent('Status atualizado com sucesso!'));
    
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.redirect('/admin/orders?error=' + encodeURIComponent('Erro ao atualizar status'));
  }
};