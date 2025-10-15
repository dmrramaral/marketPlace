const mongoose = require('mongoose');

// Cache de conexão para ambientes serverless (Vercel)
let cachedConnection = null;

async function connectToDatabase() {
  // Se já existe uma conexão em cache, reutilize
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Usando conexão MongoDB em cache');
    return cachedConnection;
  }

  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sushi';

  try {
    // Configurações otimizadas para Vercel Serverless
    const options = {
      bufferCommands: false, // Desabilita buffering para serverless
      maxPoolSize: 10, // Limite de conexões no pool
      serverSelectionTimeoutMS: 5000, // Timeout de seleção de servidor
      socketTimeoutMS: 45000, // Timeout de socket
    };

    console.log('🔄 Conectando ao MongoDB...');
    
    const connection = await mongoose.connect(dbUri, options);
    
    cachedConnection = connection;
    
    console.log('✅ Conectado ao banco de dados MongoDB - MarketPlace');
    
    return connection;
  } catch (err) {
    console.error('❌ Erro de conexão com o banco de dados:', err);
    cachedConnection = null;
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
