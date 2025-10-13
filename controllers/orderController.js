const { Order, OrderItem, Cart, Product } = require('../models');
const { sequelize } = require('../models');

exports.checkout = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    
    if (!cartItems || cartItems.length === 0) {
      return res.redirect('/cart?error=' + encodeURIComponent('Carrinho vazio'));
    }
    
    let total = 0;
    cartItems.forEach(item => {
      total += parseFloat(item.Product.preco) * item.quantidade;
    });
    
    res.render('orders/checkout', {
      title: 'Finalizar Pedido',
      cartItems,
      total
    });
    
  } catch (error) {
    console.error('Erro ao carregar checkout:', error);
    res.redirect('/cart?error=' + encodeURIComponent('Erro ao processar checkout'));
  }
};

exports.processOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.session.user.id;
    const { endereco, complemento, cidade, estado, cep, formaPagamento, observacoes } = req.body;
    
    if (!endereco || !cidade || !estado || !cep || !formaPagamento) {
      await transaction.rollback();
      return res.redirect('/orders/checkout?error=' + encodeURIComponent('Preencha todos os campos obrigatórios'));
    }
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
      transaction
    });
    
    if (!cartItems || cartItems.length === 0) {
      await transaction.rollback();
      return res.redirect('/cart?error=' + encodeURIComponent('Carrinho vazio'));
    }
    
    let valorTotal = 0;
    cartItems.forEach(item => {
      valorTotal += parseFloat(item.Product.preco) * item.quantidade;
    });
    
    const enderecoCompleto = `${endereco}${complemento ? ', ' + complemento : ''}, ${cidade} - ${estado}, CEP: ${cep}`;
    
    const order = await Order.create({
      userId,
      valorTotal,
      formaPagamento,
      enderecoEntrega: enderecoCompleto,
      observacoes,
      status: 'pendente',
      dataEntregaPrevista: new Date(Date.now() + 2 * 60 * 60 * 1000) 
    }, { transaction });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.Product.id,
        quantidade: item.quantidade,
        precoUnitario: item.Product.preco,
        subtotal: parseFloat(item.Product.preco) * item.quantidade
      }, { transaction });
      
      await item.Product.update({
        estoque: item.Product.estoque - item.quantidade
      }, { transaction });
    }
    
    await Cart.destroy({ where: { userId }, transaction });
    
    await transaction.commit();
    
    res.redirect(`/orders/${order.id}/success`);
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao processar pedido:', error);
    res.redirect('/orders/checkout?error=' + encodeURIComponent('Erro ao processar pedido'));
  }
};

exports.orderSuccess = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, include: [{ model: Product }] }]
    });
    
    if (!order) {
      return res.redirect('/orders?error=' + encodeURIComponent('Pedido não encontrado'));
    }
    
    res.render('orders/success', {
      title: 'Pedido Realizado',
      order
    });
    
  } catch (error) {
    console.error('Erro ao carregar pedido:', error);
    res.redirect('/orders?error=' + encodeURIComponent('Erro ao carregar pedido'));
  }
};

exports.myOrders = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [{ model: Product }] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.render('orders/list', {
      title: 'Meus Pedidos',
      orders
    });
    
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.render('orders/list', {
      title: 'Meus Pedidos',
      orders: []
    });
  }
};

exports.orderDetails = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, include: [{ model: Product }] }]
    });
    
    if (!order) {
      return res.redirect('/orders?error=' + encodeURIComponent('Pedido não encontrado'));
    }
    
    res.render('orders/details', {
      title: `Pedido #${order.id}`,
      order
    });
    
  } catch (error) {
    console.error('Erro ao carregar pedido:', error);
    res.redirect('/orders?error=' + encodeURIComponent('Erro ao carregar pedido'));
  }
};