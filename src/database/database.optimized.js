const mongoose = require('mongoose');

// Cache de conexão para ambientes serverless (Vercel)
let cachedConnection = null;
let isConnecting = false;

async function connectToDatabase() {
  // Se já existe uma conexão ativa, reutilize
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Usando conexão MongoDB em cache (readyState: 1)');
    return cachedConnection;
  }

  // Se está conectando, aguarde
  if (isConnecting) {
    console.log('⏳ Aguardando conexão em andamento...');
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(interval);
          resolve(cachedConnection);
        }
      }, 100);
    });
  }

  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sushi';

  try {
    isConnecting = true;
    
    // Configurações otimizadas para Vercel Serverless
    const options = {
      bufferCommands: true, // IMPORTANTE: true para evitar erros em serverless
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Aumentado para 10s
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log('🔄 Conectando ao MongoDB...');
    console.log('📝 URI:', dbUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Log seguro
    
    const connection = await mongoose.connect(dbUri, options);
    
    cachedConnection = connection;
    isConnecting = false;
    
    console.log('✅ Conectado ao banco de dados MongoDB - MarketPlace');
    console.log('📊 ReadyState:', mongoose.connection.readyState);
    
    return connection;
  } catch (err) {
    console.error('❌ Erro de conexão com o banco de dados:', err.message);
    console.error('🔍 Detalhes:', err);
    cachedConnection = null;
    isConnecting = false;
    throw err;
  }
}

// Tratamento de eventos de conexão
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB: Conexão estabelecida');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB: Erro na conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB: Desconectado');
  cachedConnection = null;
});

module.exports = connectToDatabase;
