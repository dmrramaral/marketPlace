# Wallace Lanches - API de Gerenciamento

> API completa para gerenciamento de lanchonete. Sistema com autenticação, usuários, produtos (lanches e bebidas), categorias, carrinho de compras e pedidos.

## 🍔 Sobre o Wallace Lanches

Sistema de gerenciamento completo para lanchonete, desenvolvido com tecnologias modernas e arquitetura RESTful. Ideal para integração com aplicações frontend web ou mobile.

## Tecnologias
- Node.js + Express
- MongoDB + Mongoose
- Swagger (swagger-jsdoc + swagger-ui-express)
- JWT para autenticação
- bcrypt para criptografia de senhas

## Requisitos
- Node.js 16+ (recomendado)
- MongoDB (local ou Atlas)

## Instalação

1. Instale dependências:

```bash
npm install
```

2. Variáveis de ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis básicas:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wallace-lanches
JWT_SECRET=your_super_secure_random_jwt_secret_key_here_min_32_chars
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

O servidor irá subir por padrão em `http://localhost:3000` (ou conforme `PORT`).

## 📚 Documentação (Swagger)

Após subir o servidor, abra a documentação interativa em:

```
http://localhost:3000/docs/api-docs
```

Para usar a autenticação no Swagger:
1. Faça login em `/api/auth/login`
2. Copie o token JWT retornado
3. Clique em "Authorize" no Swagger UI
4. Cole o token no formato: `Bearer <seu-token>`

---

## 🚀 Rotas da API - Guia Completo para Frontend

### 🔐 Autenticação

#### Login
- **POST** `/api/auth/login`
- Descrição: Realiza autenticação do usuário e retorna token JWT
- Autenticação: Não requerida
- Body:
```json
{
  "email": "usuario@email.com",
  "password": "Senha123!"
}
```
- Resposta (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 👤 Usuários

#### Criar Usuário
- **POST** `/api/user/create`
- Descrição: Cria um novo usuário no sistema
- Autenticação: Não requerida
- Body:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123!",
  "addresses": [
    {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567",
      "country": "BR"
    }
  ]
}
```

#### Buscar Perfil do Usuário Autenticado
- **GET** `/api/user/profile`
- Descrição: Retorna dados do usuário logado
- Autenticação: Bearer Token
- Headers: `Authorization: Bearer <token>`

#### Listar Todos os Usuários
- **GET** `/api/user`
- Descrição: Lista todos os usuários (com paginação)
- Autenticação: Bearer Token
- Query Params: 
  - `page` (opcional): Número da página (padrão: 1)
  - `limit` (opcional): Itens por página (padrão: 10)
- Exemplo: `/api/user?page=1&limit=10`

#### Buscar Usuário por ID
- **GET** `/api/user/:id`
- Descrição: Retorna dados de um usuário específico
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário

#### Atualizar Usuário
- **PUT** `/api/user/:id`
- Descrição: Atualiza dados de um usuário
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário
- Body:
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

#### Deletar Usuário
- **DELETE** `/api/user/:id`
- Descrição: Remove um usuário do sistema
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário

#### Adicionar Produto aos Favoritos
- **POST** `/api/user/:id/favorites`
- Descrição: Adiciona um produto à lista de favoritos do usuário
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário
- Body:
```json
{
  "productId": "65abc123def456789012345"
}
```

#### Remover Produto dos Favoritos
- **DELETE** `/api/user/:id/favorites`
- Descrição: Remove um produto da lista de favoritos
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário
- Body:
```json
{
  "productId": "65abc123def456789012345"
}
```

#### Adicionar Endereço ao Usuário
- **POST** `/api/user/:id/address`
- Descrição: Adiciona um novo endereço ao usuário
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do usuário
- Body:
```json
{
  "addresses": [
    {
      "street": "Av. Paulista, 1000",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-100",
      "country": "BR"
    }
  ]
}
```

---

### 🍔 Produtos (Lanches e Bebidas)

#### Criar Produto
- **POST** `/api/product/products/create`
- Descrição: Cria um novo produto (lanche, bebida, etc.)
- Autenticação: Bearer Token
- Body:
```json
{
  "name": "X-Bacon Especial",
  "description": "Hambúrguer artesanal com bacon crocante",
  "price": 25.90,
  "category": ["65abc123def456789012345"],
  "stock": 50
}
```

#### Listar Todos os Produtos
- **GET** `/api/product/products`
- Descrição: Lista todos os produtos disponíveis (com paginação)
- Autenticação: Não requerida
- Query Params:
  - `page` (opcional): Número da página
  - `limit` (opcional): Itens por página
- Exemplo: `/api/product/products?page=1&limit=20`

#### Buscar Produto por ID
- **GET** `/api/product/products/:id`
- Descrição: Retorna detalhes de um produto específico
- Autenticação: Não requerida
- Parâmetros: `id` - ID do produto

#### Atualizar Produto
- **PUT** `/api/product/products/:id`
- Descrição: Atualiza informações de um produto
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do produto
- Body:
```json
{
  "name": "X-Bacon Premium",
  "description": "Hambúrguer artesanal com bacon defumado",
  "price": 29.90,
  "category": ["65abc123def456789012345"],
  "stock": 30
}
```

#### Deletar Produto
- **DELETE** `/api/product/products/:id`
- Descrição: Remove um produto do sistema
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do produto

---

### 📂 Categorias

#### Criar Categoria
- **POST** `/api/category/categories/create`
- Descrição: Cria uma nova categoria de produtos
- Autenticação: Bearer Token
- Body:
```json
{
  "name": "Lanches",
  "description": "Hambúrgueres e sanduíches"
}
```

#### Listar Todas as Categorias
- **GET** `/api/category/categories`
- Descrição: Lista todas as categorias disponíveis
- Autenticação: Não requerida

#### Buscar Categoria por ID
- **GET** `/api/category/categories/:id`
- Descrição: Retorna detalhes de uma categoria específica
- Autenticação: Não requerida
- Parâmetros: `id` - ID da categoria

#### Atualizar Categoria
- **PUT** `/api/category/categories/:id`
- Descrição: Atualiza informações de uma categoria
- Autenticação: Bearer Token
- Parâmetros: `id` - ID da categoria
- Body:
```json
{
  "name": "Lanches Premium",
  "description": "Hambúrgueres artesanais e especiais"
}
```

#### Deletar Categoria
- **DELETE** `/api/category/categories/:id`
- Descrição: Remove uma categoria do sistema
- Autenticação: Bearer Token
- Parâmetros: `id` - ID da categoria

---

### 🛒 Carrinho de Compras

#### Buscar Carrinho do Usuário
- **GET** `/api/cart/cart`
- Descrição: Retorna o carrinho do usuário autenticado
- Autenticação: Bearer Token

#### Buscar Todos os Carrinhos (Admin)
- **GET** `/api/cart/carts`
- Descrição: Lista todos os carrinhos do sistema
- Autenticação: Bearer Token

#### Adicionar Produtos ao Carrinho
- **POST** `/api/cart/carts/products`
- Descrição: Adiciona produtos ao carrinho
- Autenticação: Bearer Token
- Body:
```json
{
  "products": [
    {
      "_id": "65abc123def456789012345",
      "quantity": 2
    },
    {
      "_id": "65abc123def456789012346",
      "quantity": 1
    }
  ]
}
```

#### Remover Produto do Carrinho
- **DELETE** `/api/cart/carts/products`
- Descrição: Remove um produto do carrinho
- Autenticação: Bearer Token
- Body:
```json
{
  "products": [
    {
      "_id": "65abc123def456789012345"
    }
  ]
}
```

#### Atualizar Quantidade de Produto
- **PUT** `/api/cart/carts/products`
- Descrição: Atualiza a quantidade de um produto no carrinho
- Autenticação: Bearer Token
- Body:
```json
{
  "productId": "65abc123def456789012345",
  "quantity": 3
}
```

#### Realizar Pagamento do Carrinho
- **POST** `/api/cart/pay`
- Descrição: Finaliza a compra do carrinho
- Autenticação: Bearer Token
- Body:
```json
{
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456789"
}
```

---

### 📦 Pedidos (Orders)

#### Criar Pedido a partir do Carrinho
- **POST** `/api/order/from-cart`
- Descrição: Cria um pedido a partir dos itens do carrinho
- Autenticação: Bearer Token

#### Listar Meus Pedidos
- **GET** `/api/order/my`
- Descrição: Lista todos os pedidos do usuário autenticado
- Autenticação: Bearer Token

#### Buscar Pedido por ID
- **GET** `/api/order/my/:id`
- Descrição: Retorna detalhes de um pedido específico do usuário
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do pedido

#### Listar Todos os Pedidos (Admin)
- **GET** `/api/order/all`
- Descrição: Lista todos os pedidos do sistema
- Autenticação: Bearer Token

#### Atualizar Status do Pedido (Admin)
- **PUT** `/api/order/:id/status`
- Descrição: Atualiza o status de um pedido
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do pedido
- Body:
```json
{
  "status": "em_preparo"
}
```

#### Deletar Pedido (Admin)
- **DELETE** `/api/order/:id`
- Descrição: Remove um pedido do sistema
- Autenticação: Bearer Token
- Parâmetros: `id` - ID do pedido

---

## 📋 Exemplos de Integração Frontend

### Exemplo: Login e Autenticação
```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'YourPassword123!'
  })
});

const data = await response.json();
const token = data.token;

// Usar token nas próximas requisições
const productsResponse = await fetch('http://localhost:3000/api/product/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Exemplo: Adicionar Produto ao Carrinho
```javascript
const addToCart = async (productId, quantity, token) => {
  const response = await fetch('http://localhost:3000/api/cart/carts/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      products: [
        {
          _id: productId,
          quantity: quantity
        }
      ]
    })
  });
  
  return await response.json();
};
```

### Exemplo: Listar Produtos com Paginação
```javascript
const getProducts = async (page = 1, limit = 10) => {
  const response = await fetch(
    `http://localhost:3000/api/product/products?page=${page}&limit=${limit}`
  );
  
  return await response.json();
};
```

---

## 🔧 Estrutura do Projeto

```text
.env         # Variáveis de ambiente
.gitignore   # Arquivos ignorados pelo git
index.js     # Ponto de entrada
LICENSE      # Licença
package.json # Dependências e scripts
README.md    # Documentação
src/
    controller/   # Lógica das rotas
    database/     # Conexão com MongoDB
    middleware/   # Middlewares (ex: autenticação)
    model/        # Modelos do banco
    router/       # Rotas da API
    service/      # Regras de negócio
```

---

## 🛡️ Boas Práticas de Segurança

- Sempre use HTTPS em produção
- Mantenha o JWT_SECRET seguro e complexo
- Nunca exponha credenciais no código
- Valide todos os inputs no frontend antes de enviar
- Implemente rate limiting para prevenir ataques
- Use variáveis de ambiente para configurações sensíveis

---

## 🚀 Deploy

O projeto está configurado para deploy na Vercel. Configure as variáveis de ambiente:
- `MONGODB_URI` - URL de conexão do MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `FRONTEND_URL` - URL do frontend para CORS

---

## 📝 Licença

Este projeto está sob a licença GNU GPL v3. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvedor

Projeto mantido por: dmrramaral

---

<div align="center">
  <h3>🍔 Wallace Lanches - Sistema de Gerenciamento 🍔</h3>
  <p>Backend robusto e completo para lanchonetes</p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <br>
  <img src="https://img.shields.io/github/license/dmrramaral/marketPlace?style=for-the-badge" />
</div>
