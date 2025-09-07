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
