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

console.error('🚀 Iniciando servidor...');
console.error('📝 NODE_ENV:', process.env.NODE_ENV);
console.error('📝 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ Não configurado');
console.error('📝 FRONTEND_URL:', process.env.FRONTEND_URL || '❌ Não configurado');

const app = express();
const port = process.env.PORT || 3000;

// Configuração de CORS para aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://sushi-app-ashen.vercel.app', // URL do frontend na Vercel (SEM barra no final!)
  process.env.FRONTEND_URL, // URL do frontend na Vercel (configurar no .env)
  /https:\/\/.*\.vercel\.app$/, // Aceita qualquer subdomínio do Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 CORS: Origem da requisição:', origin);
    
    // Permite requisições sem origem (mobile apps, curl, etc)
    if (!origin) {
      console.log('✅ CORS: Requisição sem origem - PERMITIDA');
      return callback(null, true);
    }
    
    // Verifica se a origem está na lista permitida ou match com regex
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        const matches = allowedOrigin.test(origin);
        console.log(`🧪 CORS: Testando regex ${allowedOrigin} contra ${origin}: ${matches}`);
        return matches;
      }
      const matches = allowedOrigin === origin;
      console.log(`🧪 CORS: Testando ${allowedOrigin} === ${origin}: ${matches}`);
      return matches;
    });
    
    if (isAllowed) {
      console.log('✅ CORS: Origem PERMITIDA:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origem BLOQUEADA:', origin);
      console.log('📋 CORS: Origens permitidas:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

// �️ Middleware adicional para garantir headers CORS em TODAS as respostas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Lista de origens permitidas
  const allowed = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://sushi-app-ashen.vercel.app',
    process.env.FRONTEND_URL
  ];
  
  // Verifica se a origem está permitida ou se é um domínio *.vercel.app
  if (allowed.includes(origin) || (origin && /https:\/\/.*\.vercel\.app$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    console.error(`✅ Headers CORS adicionados para: ${origin}`);
  }
  
  // Responder requisições OPTIONS (preflight) imediatamente
  if (req.method === 'OPTIONS') {
    console.error(`⚡ Respondendo preflight OPTIONS para ${req.url}`);
    return res.sendStatus(204);
  }
  
  next();
});


// 🏥 Health Check - Endpoint de teste
app.get('/health', (req, res) => {
  console.error('🏥 Health check chamado!');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    message: 'Backend funcionando! ✅'
  });
});

// 🧪 Endpoint de teste de CORS
app.get('/test-cors', (req, res) => {
  console.error('🧪 Test CORS chamado!');
  console.error('Origin da requisição:', req.headers.origin);
  res.json({ 
    message: 'Se você recebeu isso, o CORS está OK!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});


// 🔗 Middleware para garantir conexão com banco antes de processar rotas
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
    res.status(503).json({ 
      error: 'Serviço temporariamente indisponível',
      message: 'Não foi possível conectar ao banco de dados'
    });
  }
});

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

// 🚀 Inicializar servidor e conectar ao banco
async function startServer() {
  try {
    // Conectar ao banco ANTES de iniciar o servidor
    await connectToDatabase();
    
    app.listen(port, () => {
      console.log(`✅ Servidor rodando na porta ${port}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Para Vercel (serverless), exportar o app diretamente
if (process.env.VERCEL) {
  console.log('🔷 Modo Vercel Serverless - App exportado');
  module.exports = app;
} else {
  // Para desenvolvimento local, iniciar servidor normalmente
  startServer();
}
