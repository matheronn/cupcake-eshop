# Cupcakes E-shop

E-commerce completo para venda de cupcakes artesanais desenvolvido como Projeto Integrador Transdisciplinar em Sistemas de Informação II (PIT-II).

---

## Sobre o Projeto

Sistema de e-commerce desenvolvido com arquitetura MVC (Model-View-Controller) que permite:

### Para Clientes:
- Cadastro e autenticação de usuários
- Navegação por catálogo de produtos com filtros
- Carrinho de compras com atualização em tempo real
- Finalização de pedidos com múltiplas formas de pagamento
- Acompanhamento de pedidos realizados
- Sistema de notificações toast

### Para Administradores:
- Dashboard com estatísticas em tempo real
- Gestão completa de produtos (CRUD)
- Upload de imagens de produtos
- Gerenciamento de pedidos
- Controle de estoque
- Atualização de status de pedidos

---

## Tecnologias Utilizadas

### Backend:
- **Node.js** (v22.x)
- **Express.js** (Framework web)
- **Sequelize** (ORM)
- **SQLite** (Banco de dados)
- **bcrypt** (Criptografia de senhas)
- **express-session** (Gerenciamento de sessões)
- **multer** (Upload de arquivos)

### Frontend:
- **EJS** (Template engine)
- **Bootstrap 5** (Framework CSS)
- **Bootstrap Icons**
- **JavaScript Vanilla**

### Padrões e Arquitetura:
- **MVC** (Model-View-Controller)
- **RESTful API**
- **Debounce** para otimização de requisições
- **Transações SQL** para integridade de dados

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) versão 22.x ou superior

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/matheronn/cupcake-eshop.git
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
O SQLite cria automaticamente o arquivo `database.db` na primeira execução.

### 4. Crie um administrador
```bash
node create-admin.js
```
Será criado um admin com:
- **Email:** admin@cupcakes.com
- **Senha:** admin123456

### 5. Inicie o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## Credenciais de Teste

### Administrador:
- **Email:** admin@cupcakes.com
- **Senha:** admin123456
- **Tipo:** Selecionar "Administrador" no login

---

## 🧪 Testes Realizados

O sistema foi testado por **5 usuários reais** conforme requisito do PIT-II.

### Principais Correções Implementadas:
- Sistema de notificações toast ao adicionar ao carrinho
- Modal de confirmação substituindo popups nativos
- Debounce nas atualizações do carrinho
- Páginas de detalhes de produtos e pedidos
- Correção de rotas e validações

---

## 📚 Funcionalidades Principais

### Sistema de Autenticação
- Cadastro com validação de senha forte (mínimo 8 caracteres, letras e números)
- Login com bloqueio após 5 tentativas falhas (15 minutos)
- Senhas criptografadas com bcrypt
- Controle de sessões
- Diferenciação entre cliente e administrador

### Gestão de Produtos
- CRUD completo de produtos
- Upload de imagens (até 5MB)
- Controle de estoque
- Categorização de produtos
- Ativação/desativação de produtos

### Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades com debounce (500ms)
- Persistência no banco de dados
- Validação de estoque em tempo real
- Cálculo automático de totais

### Sistema de Pedidos
- Checkout com dados de entrega
- Múltiplas formas de pagamento (Crédito, Débito, PIX)
- Acompanhamento de status
- Histórico completo de pedidos
- Controle de estoque automático

### Painel Administrativo
- Dashboard com estatísticas
- Gerenciamento de produtos
- Visualização de todos os pedidos
- Atualização de status de pedidos
- Upload de imagens de produtos

---

## Autor

**Matheus Eduardo Macarini**
- RGM: 29584043
- GitHub: [@matheronn](https://github.com/matheronn)
- Projeto: PIT-II - Sistemas de Informação

---

## Agradecimentos

- Testadores que contribuíram com feedback valioso:
  - Karen Abib
  - Alisson de Morais
  - Samuel de Oliveira Arcolino Sales
  - Mariane Vergara Okumoto
  - Marcos Aurelio Macarini

---

**Desenvolvido com 💜 para o PIT-II | Outubro 2025**