# MarketPlace API

> API simples de exemplo para um marketplace de calçados. Contém endpoints para autenticação, usuários, categorias, produtos, carrinho e tickets.

## Tecnologias
- Node.js + Express
- MongoDB + Mongoose
- Swagger (swagger-jsdoc + swagger-ui-express)
- JWT para autenticação

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
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=algumsegredodetoken
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

O servidor irá subir por padrão em `http://localhost:3000` (ou conforme `PORT`).

## Rotas principais

O projeto usa prefixos nas rotas montadas em `index.js`:

- `/api/auth` — autenticação (login/registro)
- `/api/user` — usuários
- `/api/product` — produtos
- `/api/category` — categorias
- `/api/cart` — carrinho
- `/docs` — Swagger UI

Exemplo de rota pública (health): `GET /`

## Documentação (Swagger)

Após subir o servidor, abra a documentação em:

```
http://localhost:3000/docs/api-docs
```

Os schemas principais foram definidos em `src/router/docs.router.js` e os JSDoc por endpoint estão nos arquivos dentro de `src/router/`.

Para usar a opção Authorize (Bearer token) na UI do Swagger, copie o token JWT obtido em `/api/auth/login` e clique em Authorize > `Bearer <token>`.

## Postman

Há uma coleção de Postman no repositório: `marketplace.postman_collection.json`. Use as variáveis:

- `{{baseUrl}}` — ex: `http://localhost:3000`
- `{{jwt}}` — token JWT retornado no login

Exemplos incluídos na coleção:
- Auth / Login
- User - Create
- User - Get All
- Product - Create / List / GetById
- Category - Create / List
- Cart - Add Products / Get My Cart / Pay

## Formatos esperados (exemplos)

- Criar usuário (POST /api/user/create):

```json
{
    "name": "João Silva",
    "email": "user@example.com",
    "password": "Senha123!",
    "addresses": [ { "street": "Rua A, 123", "city": "Cidade", "state": "SP", "zipCode": "01234-567", "country": "BR" } ]
}
```

- Criar produto (POST /api/product/products/create) — enviar `category` como array de ids (recomendado):

```json
{
    "name": "Tênis Exemplo",
    "description": "Tênis confortável",
    "price": 199.9,
    "category": [ "68abcd1234ef567890abcdef" ],
    "stock": 10
}
```

- Adicionar produtos ao carrinho (POST /api/cart/carts/products):

```json
{
    "products": [ { "_id": "<productId>", "quantity": 2 } ]
}
```

## Boas práticas e notas

- Prefira enviar referências (`ObjectId`) para relacionamentos e usar `.populate()` no retorno quando precisar do documento completo.
- Os schemas para requisição/resposta estão centralizados em `src/router/docs.router.js` para evitar duplicação nos JSDoc dos routers.
- Valide os ids e os formatos no cliente antes de enviar (ex.: `validaIdParam`, `validation.middleware`).

## Próximos passos recomendados

- Adicionar testes (jest + supertest) para endpoints críticos.
- Incluir middlewares de segurança: `helmet`, `express-rate-limit`.
- Implementar integração com gateway de pagamento (ou mock de pagamento) para o fluxo de tickets.

## Contato

Projeto mantido por: dmrramaral

# marketPlace

<div align="center">
    <h1>🛒 marketPlace</h1>
    <p>Backend de uma loja de sapatos feito com <b>Node.js</b>, <b>Express</b> e <b>MongoDB</b></p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
    <br>
    <img src="https://img.shields.io/github/license/dmrramaral/marketPlace?style=for-the-badge" />
</div>

---

## 📦 Estrutura do Projeto

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

## 🚀 Funcionalidades

- 👤 Cadastro, autenticação e gerenciamento de usuários
- 🛍️ CRUD de produtos e categorias
- ⭐ Favoritar produtos e gerenciar endereços do usuário
- 🎫 Sistema de tickets para suporte
- 🛒 Carrinho de compras e pagamento
- 🔒 Proteção de rotas com autenticação JWT

## ⚡ Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/dmrramaral/marketPlace.git

# 2. Instale as dependências
npm install

# 3. Configure o arquivo .env
# Exemplo:
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=sua_chave_secreta
PORT=3000

# 4. Inicie o servidor
npm run dev
```

## 📚 Rotas Principais

### Usuário
- `POST /api/user/create` - Criar usuário
- `GET /api/user` - Listar usuários
- `GET /api/user/:id` - Buscar usuário por ID
- `PUT /api/user/:id` - Atualizar usuário
- `DELETE /api/user/:id` - Deletar usuário
- `POST /api/user/:id/favorites` - Adicionar produto aos favoritos
- `DELETE /api/user/:id/favorites` - Remover produto dos favoritos
- `POST /api/user/:id/address` - Adicionar endereço
- `DELETE /api/user/:id/address` - Remover endereço

### Autenticação
- `POST /api/auth/login` - Login do usuário

### Produto
- `POST /api/product/products/create` - Criar produto
- `GET /api/product/products` - Listar produtos
- `GET /api/product/products/:id` - Buscar produto por ID
- `PUT /api/product/products/:id` - Atualizar produto
- `DELETE /api/product/products/:id` - Deletar produto

### Categoria
- `POST /api/category/categories/create` - Criar categoria
- `GET /api/category/categories` - Listar categorias
- `GET /api/category/categories/:id` - Buscar categoria por ID
- `PUT /api/category/categories/:id` - Atualizar categoria
- `DELETE /api/category/categories/:id` - Deletar categoria

### Carrinho
- `GET /api/cart/cart` - Buscar carrinho do usuário
- `GET /api/cart/carts` - Buscar todos os carrinhos (admin)
- `POST /api/cart/carts/products` - Adicionar produtos ao carrinho
- `DELETE /api/cart/carts/products` - Remover produto do carrinho
- `POST /api/cart/pay` - Realizar pagamento do carrinho

## 📝 Exemplos de Uso

### Requisição de Login
```http
POST /api/auth/login
Content-Type: application/json
{
    "email": "usuario@email.com",
    "password": "Senha123*"
}
```

### Resposta
```json
{
    "token": "<jwt_token>"
}
```

## 📄 Licença

Este projeto está sob a licença GNU GPL v3. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
