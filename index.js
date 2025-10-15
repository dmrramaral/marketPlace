const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./src/database/database.optimized");
const userRouter = require('./src/router/user.router');
const authRouter = require('./src/router/auth.router');
const productRouter = require('./src/router/product.router');
const categoryRouter = require('./src/router/category.router');
const cartRouter = require('./src/router/cart.router');
const docsRouter = require('./src/router/docs.router');
const orderRouter = require('./src/router/order.router');

//cors


require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração de CORS para aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://sushi-app-ashen.vercel.app/', // URL do frontend na Vercel (substitua pela sua)
  process.env.FRONTEND_URL, // URL do frontend na Vercel (configurar no .env)
  /https:\/\/.*\.vercel\.app$/, // Aceita qualquer subdomínio do Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origem (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista permitida ou match com regex
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ Origem bloqueada pelo CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));



connectToDatabase();
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/docs', docsRouter);

app.get("/", (req, res) => {
  res.send("Bem-vindo ao servidor de market Place da Loja de calcados!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


