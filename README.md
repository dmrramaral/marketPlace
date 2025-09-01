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

| Método | Rota                | Descrição                       |
|--------|---------------------|---------------------------------|
| POST   | /api/auth/login     | Login do usuário                |
| GET    | /api/user           | Listar usuários                 |
| POST   | /api/user           | Criar usuário                   |
| GET    | /api/product        | Listar produtos                 |
| POST   | /api/product        | Criar produto                   |
| GET    | /api/category       | Listar categorias               |
| POST   | /api/category       | Criar categoria                 |

## 📝 Exemplos de Uso

### Requisição de Login
```http
POST /api/auth/login
Content-Type: application/json
{
	"email": "usuario@email.com",
	"password": "senha123"
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
