const { Cart, Product } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantidade = 1 } = req.body;
    const userId = req.session.user.id;
    
    const product = await Product.findByPk(productId);
    
    if (!product || !product.ativo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produto não encontrado' 
      });
    }
    
    if (product.estoque < quantidade) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estoque insuficiente' 
      });
    }
    
    let cartItem = await Cart.findOne({
      where: { userId, productId }
    });
    
    if (cartItem) {
      const novaQuantidade = cartItem.quantidade + parseInt(quantidade);
      
      if (product.estoque < novaQuantidade) {
        return res.status(400).json({ 
          success: false, 
          message: 'Estoque insuficiente para essa quantidade' 
        });
      }
      
      await cartItem.atualizarQuantidade(novaQuantidade);
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantidade: parseInt(quantidade)
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Produto adicionado ao carrinho!' 
    });
    
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao adicionar ao carrinho' 
    });
  }
};

exports.viewCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
      order: [['createdAt', 'ASC']]
    });
    
    let total = 0;
    cartItems.forEach(item => {
      if (item.Product) {
        total += parseFloat(item.Product.preco) * item.quantidade;
      }
    });
    
    res.render('cart/view', {
      title: 'Meu Carrinho',
      cartItems,
      total
    });
    
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    res.render('cart/view', {
      title: 'Meu Carrinho',
      cartItems: [],
      total: 0
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { itemId, quantidade } = req.body;
    const userId = req.session.user.id;
    
    const cartItem = await Cart.findOne({
      where: { id: itemId, userId },
      include: [{ model: Product }]
    });
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item não encontrado' 
      });
    }
    
    if (cartItem.Product.estoque < quantidade) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estoque insuficiente' 
      });
    }
    
    await cartItem.atualizarQuantidade(parseInt(quantidade));
    
    res.json({ 
      success: true, 
      message: 'Quantidade atualizada!' 
    });
    
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar quantidade' 
    });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.session.user.id;
    
    const cartItem = await Cart.findOne({
      where: { id: itemId, userId }
    });
    
    if (!cartItem) {
      return res.redirect('/cart?error=' + encodeURIComponent('Item não encontrado'));
    }
    
    await cartItem.destroy();
    
    res.redirect('/cart?success=' + encodeURIComponent('Item removido do carrinho'));
    
  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.redirect('/cart?error=' + encodeURIComponent('Erro ao remover item'));
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    await Cart.destroy({ where: { userId } });
    
    res.redirect('/cart?success=' + encodeURIComponent('Carrinho esvaziado'));
    
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.redirect('/cart?error=' + encodeURIComponent('Erro ao limpar carrinho'));
  }
};