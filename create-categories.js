const { Category } = require('./models');

async function createCategories() {
  try {
    const categories = [
      { nome: 'Chocolate', descricao: 'Cupcakes de chocolate', ativo: true },
      { nome: 'Frutas', descricao: 'Cupcakes com sabores de frutas', ativo: true },
      { nome: 'Especiais', descricao: 'Cupcakes com sabores especiais', ativo: true },
      { nome: 'Veganos', descricao: 'Cupcakes veganos', ativo: true },
      { nome: 'Sem Glúten', descricao: 'Cupcakes sem glúten', ativo: true }
    ];

    for (const cat of categories) {
      await Category.create(cat);
      console.log(`✓ Categoria "${cat.nome}" criada`);
    }

    console.log('\nTodas as categorias foram criadas!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

createCategories();