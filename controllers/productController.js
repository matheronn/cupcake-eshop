const { Product, Category } = require('../models');
const { Op } = require('sequelize');

exports.catalog = async (req, res) => {
  try {
    const { categoria, busca, precoMin, precoMax } = req.query;
    
    const where = { ativo: true };
    
    if (categoria) {
      where.categoryId = categoria;
    }
    
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { descricao: { [Op.like]: `%${busca}%` } }
      ];
    }
    
    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco[Op.gte] = parseFloat(precoMin);
      if (precoMax) where.preco[Op.lte] = parseFloat(precoMax);
    }
    
    const products = await Product.findAll({
      where,
      include: [{ model: Category }],
      order: [['nome', 'ASC']]
    });
    
    const categories = await Category.findAll({ 
      where: { ativo: true },
      order: [['nome', 'ASC']]
    });
    
    res.render('products/catalog', {
      title: 'Catálogo de Cupcakes',
      products,
      categories,
      filters: { categoria, busca, precoMin, precoMax }
    });
    
  } catch (error) {
    console.error('Erro ao carregar catálogo:', error);
    res.render('products/catalog', {
      title: 'Catálogo de Cupcakes',
      products: [],
      categories: [],
      filters: {}
    });
  }
};

exports.details = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        ativo: true
      },
      include: [{ model: Category }]
    });
    
    if (!product) {
      return res.status(404).render('404', {
        title: 'Produto não encontrado'
      });
    }
   
    const relatedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id },
        ativo: true
      },
      limit: 4
    });
   
    res.render('products/details', {
      title: product.nome,
      product,
      relatedProducts
    });
   
  } catch (error) {
    res.status(500).render('500', {
      title: 'Erro ao carregar produto',
      error
    });
  }
};