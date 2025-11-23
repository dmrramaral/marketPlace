# 📚 Documentação Back-End - Models e APIs

## Sumário
- [Introdução](#introdução)
- [Models (Modelos de Dados)](#models-modelos-de-dados)
  - [User (Usuário)](#user-usuário)
  - [Product (Produto)](#product-produto)
  - [Category (Categoria)](#category-categoria)
  - [Cart (Carrinho)](#cart-carrinho)
  - [Order (Pedido)](#order-pedido)
  - [Ticket (Suporte)](#ticket-suporte)
- [APIs Disponíveis](#apis-disponíveis)
  - [Autenticação](#autenticação)
  - [Usuários](#usuários)
  - [Produtos](#produtos)
  - [Categorias](#categorias)
  - [Carrinho](#carrinho)
  - [Pedidos](#pedidos)
- [Informações Importantes](#informações-importantes)

---

## Introdução

Este documento descreve todos os **modelos de dados** (schemas do MongoDB) e as **APIs REST** disponíveis no back-end do Wallace Lanches para que o front-end possa se conectar e integrar corretamente.

**Base URL:** `http://localhost:3000` (desenvolvimento) ou URL de produção configurada

**Documentação Swagger:** `http://localhost:3000/docs/api-docs`

---

## Models (Modelos de Dados)

### User (Usuário)

Modelo para gerenciamento de usuários do sistema.

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único do usuário (gerado automaticamente)
  name: String,                     // Nome completo do usuário (obrigatório)
  email: String,                    // Email único (obrigatório, único)
  password: String,                 // Senha criptografada (obrigatório, select: false)
  image: String,                    // URL da imagem de perfil (opcional)
  createdAt: Date,                  // Data de criação (padrão: Date.now)
  updatedAt: Date,                  // Data de última atualização (padrão: Date.now)
  
  // Produtos favoritos
  favoritesProducts: [
    {
      _id: ObjectId,                // Referência ao Product
      createdAt: Date               // Data que foi favoritado
    }
  ],
  
  // Endereços do usuário
  addresses: [
    {
      street: String,               // Rua e número
      city: String,                 // Cidade
      state: String,                // Estado (UF)
      zipCode: String,              // CEP
      country: String,              // País
      createdAt: Date               // Data de criação do endereço
    }
  ],
  
  // Permissões
  admin: Boolean,                   // Campo legado (padrão: false)
                                    // Mantido para compatibilidade, mas use 'role'
  role: String                      // Papel: 'admin', 'user', 'manager' (padrão: 'user')
                                    // Este é o campo recomendado para verificar permissões
}
```

**Observações:**
- A senha é automaticamente criptografada antes de salvar (bcrypt)
- O campo `password` não é retornado por padrão nas consultas
- O campo `updatedAt` é atualizado automaticamente

---

### Product (Produto)

Modelo para produtos (lanches, bebidas, etc.).

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único do produto
  name: String,                     // Nome do produto (obrigatório)
  description: String,              // Descrição detalhada (obrigatório)
  price: Number,                    // Preço em reais (obrigatório)
  
  // Categorias do produto
  category: [
    {
      _id: ObjectId,                // Referência à Category
      createdAt: Date
    }
  ],
  
  brand: String,                    // Marca (opcional)
  colors: [String],                 // Cores disponíveis (opcional)
  stock: Number,                    // Quantidade em estoque (obrigatório)
  images: [String],                 // URLs das imagens do produto (opcional)
  ingredients: [String],            // Ingredientes (para lanches, opcional)
  
  createdAt: Date,                  // Data de criação
  updatedAt: Date,                  // Data de atualização
  
  // Avaliações
  ratings: Number,                  // Nota média (padrão: 0)
  numReviews: Number,               // Número de avaliações (padrão: 0)
  
  // Reviews dos usuários
  reviews: [
    {
      user: ObjectId,               // Referência ao User
      comment: String,              // Comentário da avaliação
      rating: Number,               // Nota (1-5)
      createdAt: Date
    }
  ]
}
```

**Observações:**
- O campo `ingredients` é usado principalmente para lanches
- O campo `category` pode conter múltiplas categorias

---

### Category (Categoria)

Modelo para categorias de produtos.

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único da categoria
  name: String,                     // Nome da categoria (obrigatório, único)
  description: String,              // Descrição da categoria (opcional)
  createdAt: Date,                  // Data de criação (timestamps: true)
  updatedAt: Date                   // Data de atualização (timestamps: true)
}
```

**Exemplos de categorias:**
- Lanches
- Bebidas
- Sobremesas
- Porções

---

### Cart (Carrinho)

Modelo para carrinho de compras do usuário.

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único do carrinho
  user: ObjectId,                   // Referência ao User (obrigatório)
  
  // Produtos no carrinho
  products: [
    {
      _id: ObjectId,                // Referência ao Product (obrigatório)
      quantity: Number,             // Quantidade (obrigatório, min: 1)
      addedAt: Date                 // Data que foi adicionado
    }
  ],
  
  totalPrice: Number,               // Preço total (padrão: 0)
  frete: Number,                    // Valor do frete (padrão: 0)
  
  // Status de pagamento
  paymentStatus: String,            // 'pending', 'paid', 'failed', 'refunded' (padrão: 'pending')
  
  // Detalhes do pagamento
  paymentDetails: {
    method: String,                 // Método de pagamento
    paidAt: Date,                   // Data do pagamento
    transactionId: String           // ID da transação
  },
  
  createdAt: Date,                  // Data de criação
  updatedAt: Date                   // Data de atualização
}
```

**Observações:**
- Cada usuário pode ter apenas um carrinho ativo
- O `totalPrice` é calculado automaticamente baseado nos produtos

---

### Order (Pedido)

Modelo para pedidos finalizados.

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único do pedido
  user: ObjectId,                   // Referência ao User (obrigatório)
  
  // Itens do pedido
  items: [
    {
      product: ObjectId,            // Referência ao Product (obrigatório)
      name: String,                 // Nome do produto
      price: Number,                // Preço unitário (obrigatório)
      quantity: Number,             // Quantidade (obrigatório, min: 1)
      subtotal: Number              // Subtotal do item (obrigatório)
    }
  ],
  
  // Valores
  subtotal: Number,                 // Subtotal dos itens (padrão: 0)
  frete: Number,                    // Valor do frete (padrão: 0)
  total: Number,                    // Valor total (padrão: 0)
  
  // Status do pedido
  status: String,                   // 'pending', 'confirmed', 'preparing', 
                                    // 'delivering', 'completed', 'cancelled' 
                                    // (padrão: 'pending')
  
  // Pagamento
  paymentStatus: String,            // 'pending', 'paid', 'failed', 'refunded'
                                    // (padrão: 'pending')
  paymentMethod: String,            // Método de pagamento
  paidAt: Date,                     // Data do pagamento
  
  notes: String,                    // Observações do pedido
  
  createdAt: Date,                  // Data de criação
  updatedAt: Date                   // Data de atualização
}
```

**Fluxo de Status:**
1. `pending` - Pedido criado, aguardando confirmação
2. `confirmed` - Pedido confirmado
3. `preparing` - Em preparo
4. `delivering` - Em entrega
5. `completed` - Concluído
6. `cancelled` - Cancelado

---

### Ticket (Suporte)

Modelo para tickets de suporte relacionados a produtos.

**Schema:**
```javascript
{
  _id: ObjectId,                    // ID único do ticket
  user: ObjectId,                   // Referência ao User (obrigatório)
  product: ObjectId,                // Referência ao Product (obrigatório)
  issue: String,                    // Descrição do problema (obrigatório)
  
  // Status e prioridade
  status: String,                   // 'open', 'in_progress', 'closed' (padrão: 'open')
  priority: String,                 // 'low', 'medium', 'high' (padrão: 'medium')
  
  responsible: ObjectId,            // Referência ao User responsável (opcional)
  closedAt: Date,                   // Data de fechamento (opcional)
  
  // Mensagens do ticket
  messages: [
    {
      sender: ObjectId,             // Referência ao User
      text: String,                 // Texto da mensagem
      sentAt: Date                  // Data de envio
    }
  ],
  
  createdAt: Date,                  // Data de criação
  updatedAt: Date                   // Data de atualização
}
```

---

## APIs Disponíveis

### Autenticação

#### Login
```
POST /api/auth/login
```

**Descrição:** Autentica um usuário e retorna um token JWT.

**Autenticação:** Não requerida

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "Senha123!"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Códigos de Status:**
- `200` - Login bem-sucedido
- `401` - Credenciais inválidas
- `500` - Erro interno do servidor

**Uso do Token:**
Após o login, use o token em todas as requisições autenticadas no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### Usuários

#### 1. Criar Usuário
```
POST /api/user/create
```

**Autenticação:** Não requerida

**Body:**
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

**Resposta (201):**
```json
{
  "_id": "65abc123def456789012345",
  "name": "João Silva",
  "email": "joao@email.com",
  "addresses": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "admin": false,
  "role": "user"
}
```

---

#### 2. Buscar Perfil do Usuário Autenticado
```
GET /api/user/profile
```

**Autenticação:** Bearer Token (obrigatório)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "message": "Perfil recuperado com sucesso",
  "user": {
    "_id": "65abc123def456789012345",
    "name": "João Silva",
    "email": "joao@email.com",
    "image": "https://...",
    "addresses": [...],
    "favoritesProducts": [...],
    "role": "user"
  }
}
```

---

#### 3. Listar Todos os Usuários
```
GET /api/user?page=1&limit=10
```

**Autenticação:** Bearer Token (obrigatório)

**Query Params:**
- `page` (opcional) - Número da página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 10)

**Resposta (200):**
```json
{
  "users": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalUsers": 50
}
```

---

#### 4. Buscar Usuário por ID
```
GET /api/user/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Resposta (200):**
```json
{
  "_id": "65abc123def456789012345",
  "name": "João Silva",
  "email": "joao@email.com",
  ...
}
```

---

#### 5. Atualizar Usuário
```
PUT /api/user/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Body:**
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

**Resposta (200):**
```json
{
  "message": "Usuário atualizado com sucesso",
  "user": {...}
}
```

---

#### 6. Deletar Usuário
```
DELETE /api/user/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Resposta (200):**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

---

#### 7. Adicionar Produto aos Favoritos
```
POST /api/user/:id/favorites
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Body:**
```json
{
  "productId": "65abc123def456789012345"
}
```

**Resposta (200):**
```json
{
  "message": "Produto adicionado aos favoritos",
  "user": {...}
}
```

---

#### 8. Remover Produto dos Favoritos
```
DELETE /api/user/:id/favorites
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Body:**
```json
{
  "productId": "65abc123def456789012345"
}
```

**Resposta (200):**
```json
{
  "message": "Produto removido dos favoritos",
  "user": {...}
}
```

---

#### 9. Adicionar Endereço ao Usuário
```
POST /api/user/:id/address
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do usuário

**Body:**
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

**Resposta (200):**
```json
{
  "message": "Endereço adicionado com sucesso",
  "user": {...}
}
```

---

### Produtos

#### 1. Criar Produto
```
POST /api/product/products/create
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
```json
{
  "name": "X-Bacon Especial",
  "description": "Hambúrguer artesanal com bacon crocante",
  "price": 25.90,
  "category": ["65abc123def456789012345"],
  "stock": 50,
  "ingredients": ["Pão", "Hambúrguer", "Bacon", "Queijo", "Alface", "Tomate"]
}
```

**Observações:**
- O campo `ingredients` é opcional e usado principalmente para lanches
- O campo `category` aceita um array de IDs de categorias

**Resposta (201):**
```json
{
  "_id": "65abc123def456789012999",
  "name": "X-Bacon Especial",
  "description": "Hambúrguer artesanal com bacon crocante",
  "price": 25.90,
  "category": [...],
  "stock": 50,
  "ingredients": [...],
  "ratings": 0,
  "numReviews": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Listar Todos os Produtos
```
GET /api/product/products?page=1&limit=20
```

**Autenticação:** Não requerida

**Query Params:**
- `page` (opcional) - Número da página
- `limit` (opcional) - Itens por página

**Resposta (200):**
```json
{
  "products": [
    {
      "_id": "65abc123def456789012999",
      "name": "X-Bacon Especial",
      "description": "Hambúrguer artesanal com bacon crocante",
      "price": 25.90,
      "stock": 50,
      "images": [],
      "ratings": 4.5,
      "numReviews": 10
    },
    ...
  ],
  "totalPages": 3,
  "currentPage": 1,
  "totalProducts": 60
}
```

---

#### 3. Buscar Produto por ID
```
GET /api/product/products/:id
```

**Autenticação:** Não requerida

**Parâmetros:**
- `id` - ID do produto

**Resposta (200):**
```json
{
  "_id": "65abc123def456789012999",
  "name": "X-Bacon Especial",
  "description": "Hambúrguer artesanal com bacon crocante",
  "price": 25.90,
  "category": [...],
  "stock": 50,
  "ingredients": [...],
  "reviews": [...]
}
```

---

#### 4. Atualizar Produto
```
PUT /api/product/products/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do produto

**Body:**
```json
{
  "name": "X-Bacon Premium",
  "description": "Hambúrguer artesanal com bacon defumado",
  "price": 29.90,
  "stock": 30
}
```

**Observações:**
- Todos os campos são opcionais
- Apenas os campos enviados serão atualizados

**Resposta (200):**
```json
{
  "message": "Produto atualizado com sucesso",
  "product": {...}
}
```

---

#### 5. Deletar Produto
```
DELETE /api/product/products/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do produto

**Resposta (200):**
```json
{
  "message": "Produto deletado com sucesso"
}
```

---

### Categorias

#### 1. Criar Categoria
```
POST /api/category/categories/create
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
```json
{
  "name": "Lanches",
  "description": "Hambúrgueres e sanduíches"
}
```

**Resposta (201):**
```json
{
  "_id": "65abc123def456789012345",
  "name": "Lanches",
  "description": "Hambúrgueres e sanduíches",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Listar Todas as Categorias
```
GET /api/category/categories
```

**Autenticação:** Não requerida

**Resposta (200):**
```json
[
  {
    "_id": "65abc123def456789012345",
    "name": "Lanches",
    "description": "Hambúrgueres e sanduíches",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65abc123def456789012346",
    "name": "Bebidas",
    "description": "Refrigerantes e sucos",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### 3. Buscar Categoria por ID
```
GET /api/category/categories/:id
```

**Autenticação:** Não requerida

**Parâmetros:**
- `id` - ID da categoria

**Resposta (200):**
```json
{
  "_id": "65abc123def456789012345",
  "name": "Lanches",
  "description": "Hambúrgueres e sanduíches"
}
```

---

#### 4. Atualizar Categoria
```
PUT /api/category/categories/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID da categoria

**Body:**
```json
{
  "name": "Lanches Premium",
  "description": "Hambúrgueres artesanais e especiais"
}
```

**Resposta (200):**
```json
{
  "message": "Categoria atualizada com sucesso",
  "category": {...}
}
```

---

#### 5. Deletar Categoria
```
DELETE /api/category/categories/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID da categoria

**Resposta (204):**
```
No Content
```

**Observação:** Este endpoint retorna status 204 (sem conteúdo) seguindo a convenção REST, diferente de outros endpoints de delete que retornam 200 com mensagem.

---

### Carrinho

#### 1. Buscar Carrinho do Usuário
```
GET /api/cart/cart
```

**Autenticação:** Bearer Token (obrigatório)

**Descrição:** Retorna o carrinho do usuário autenticado.

**Resposta (200):**
```json
{
  "_id": "65abc123def456789012345",
  "user": "65abc123def456789012346",
  "products": [
    {
      "_id": "65abc123def456789012999",
      "quantity": 2,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPrice": 51.80,
  "frete": 5.00,
  "paymentStatus": "pending",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

#### 2. Buscar Todos os Carrinhos (Admin)
```
GET /api/cart/carts
```

**Autenticação:** Bearer Token (obrigatório)

**Descrição:** Lista todos os carrinhos do sistema (apenas para administradores).

**Resposta (200):**
```json
[
  {
    "_id": "65abc123def456789012345",
    "user": {...},
    "products": [...],
    "totalPrice": 51.80
  },
  ...
]
```

---

#### 3. Adicionar Produtos ao Carrinho
```
POST /api/cart/carts/products
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
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

**Resposta (200):**
```json
{
  "message": "Produtos adicionados ao carrinho",
  "cart": {...}
}
```

---

#### 4. Remover Produto do Carrinho
```
DELETE /api/cart/carts/products
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
```json
{
  "products": [
    {
      "_id": "65abc123def456789012345"
    }
  ]
}
```

**Resposta (200):**
```json
{
  "message": "Produto removido do carrinho",
  "cart": {...}
}
```

**Resposta (204):**
```
No Content (carrinho foi deletado se estava vazio)
```

---

#### 5. Atualizar Quantidade de Produto
```
PUT /api/cart/carts/products
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
```json
{
  "productId": "65abc123def456789012345",
  "quantity": 3
}
```

**Resposta (200):**
```json
{
  "message": "Quantidade atualizada",
  "cart": {...}
}
```

---

#### 6. Realizar Pagamento do Carrinho
```
POST /api/cart/pay
```

**Autenticação:** Bearer Token (obrigatório)

**Body:**
```json
{
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456789"
}
```

**Resposta (200):**
```json
{
  "message": "Pagamento realizado com sucesso",
  "cart": {
    ...
    "paymentStatus": "paid",
    "paymentDetails": {
      "method": "credit_card",
      "paidAt": "2024-01-15T11:00:00.000Z",
      "transactionId": "TXN123456789"
    }
  }
}
```

---

### Pedidos

#### 1. Criar Pedido a partir do Carrinho
```
POST /api/order/from-cart
```

**Autenticação:** Bearer Token (obrigatório)

**Descrição:** Cria um pedido a partir dos itens do carrinho atual do usuário.

**Resposta (201):**
```json
{
  "message": "Pedido criado com sucesso",
  "order": {
    "_id": "65abc123def456789012347",
    "user": "65abc123def456789012346",
    "items": [
      {
        "product": "65abc123def456789012999",
        "name": "X-Bacon Especial",
        "price": 25.90,
        "quantity": 2,
        "subtotal": 51.80
      }
    ],
    "subtotal": 51.80,
    "frete": 5.00,
    "total": 56.80,
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### 2. Listar Meus Pedidos
```
GET /api/order/my
```

**Autenticação:** Bearer Token (obrigatório)

**Descrição:** Lista todos os pedidos do usuário autenticado.

**Resposta (200):**
```json
[
  {
    "_id": "65abc123def456789012347",
    "user": "65abc123def456789012346",
    "items": [...],
    "total": 56.80,
    "status": "confirmed",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  ...
]
```

---

#### 3. Buscar Pedido por ID
```
GET /api/order/my/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do pedido

**Descrição:** Retorna detalhes de um pedido específico do usuário.

**Resposta (200):**
```json
{
  "_id": "65abc123def456789012347",
  "user": {...},
  "items": [
    {
      "product": {...},
      "name": "X-Bacon Especial",
      "price": 25.90,
      "quantity": 2,
      "subtotal": 51.80
    }
  ],
  "subtotal": 51.80,
  "frete": 5.00,
  "total": 56.80,
  "status": "confirmed",
  "paymentStatus": "paid",
  "paymentMethod": "credit_card",
  "paidAt": "2024-01-15T11:05:00.000Z",
  "notes": "Sem cebola",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### 4. Listar Todos os Pedidos (Admin)
```
GET /api/order/all
```

**Autenticação:** Bearer Token (obrigatório)

**Descrição:** Lista todos os pedidos do sistema (apenas para administradores).

**Resposta (200):**
```json
[
  {
    "_id": "65abc123def456789012347",
    "user": {...},
    "items": [...],
    "total": 56.80,
    "status": "confirmed",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  ...
]
```

---

#### 5. Atualizar Status do Pedido (Admin)
```
PUT /api/order/:id/status
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do pedido

**Body:**
```json
{
  "status": "preparing"
}
```

**Status válidos:**
- `pending` - Aguardando confirmação
- `confirmed` - Confirmado
- `preparing` - Em preparo
- `delivering` - Em entrega
- `completed` - Concluído
- `cancelled` - Cancelado

**Resposta (200):**
```json
{
  "message": "Status do pedido atualizado",
  "order": {...}
}
```

---

#### 6. Deletar Pedido (Admin)
```
DELETE /api/order/:id
```

**Autenticação:** Bearer Token (obrigatório)

**Parâmetros:**
- `id` - ID do pedido

**Resposta (200):**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

---

## Informações Importantes

### Autenticação JWT

Todas as rotas que requerem autenticação devem incluir o token JWT no header:

```javascript
headers: {
  'Authorization': 'Bearer SEU_TOKEN_AQUI'
}
```

**Processo de autenticação:**
1. Faça login em `/api/auth/login` com email e senha
2. Receba o token JWT na resposta
3. Armazene o token (localStorage, sessionStorage, etc.)
4. Inclua o token em todas as requisições autenticadas

### Paginação

Endpoints que suportam paginação aceitam os seguintes query params:
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

**Exemplo:**
```
GET /api/product/products?page=2&limit=20
```

### Códigos de Status HTTP

- `200` - Sucesso (OK)
- `201` - Criado (Created)
- `204` - Sem conteúdo (No Content)
- `400` - Requisição inválida (Bad Request)
- `401` - Não autorizado (Unauthorized)
- `404` - Não encontrado (Not Found)
- `500` - Erro interno do servidor (Internal Server Error)

### CORS

O backend está configurado para aceitar requisições de diferentes origens. Configure a variável de ambiente `FRONTEND_URL` para especificar a URL do frontend em produção.

### Validação de Dados

Todos os endpoints validam os dados recebidos. Certifique-se de enviar:
- Tipos de dados corretos (String, Number, Array, etc.)
- Campos obrigatórios preenchidos
- IDs válidos do MongoDB (24 caracteres hexadecimais)

### Exemplo de Integração Completa

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@email.com',
    password: 'Senha123!'
  })
});

const { token } = await loginResponse.json();

// 2. Buscar produtos (não requer autenticação)
const productsResponse = await fetch('http://localhost:3000/api/product/products?page=1&limit=10');

const products = await productsResponse.json();

// 3. Adicionar ao carrinho
const addToCartResponse = await fetch('http://localhost:3000/api/cart/carts/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    products: [
      {
        _id: products.products[0]._id,
        quantity: 2
      }
    ]
  })
});

const cart = await addToCartResponse.json();

// 4. Criar pedido
const orderResponse = await fetch('http://localhost:3000/api/order/from-cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const order = await orderResponse.json();
```

### Variáveis de Ambiente

Configure o arquivo `.env` com as seguintes variáveis:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wallace-lanches
JWT_SECRET=your_super_secure_random_jwt_secret_key_here_min_32_chars
FRONTEND_URL=http://localhost:5173
```

### Documentação Swagger

Para uma documentação interativa, acesse:
```
http://localhost:3000/docs/api-docs
```

No Swagger você pode:
- Visualizar todos os endpoints
- Testar as APIs diretamente
- Ver exemplos de requisições e respostas
- Autenticar usando o botão "Authorize"

---

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação Swagger
2. Verifique os logs do servidor
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvedor:** dmrramaral

**Licença:** GNU GPL v3
