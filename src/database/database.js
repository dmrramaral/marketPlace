const mongoose = require('mongoose');

function connectToDatabase() {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

  mongoose.connect(dbUri)
    .then(() => {
      console.log('Conectado ao banco de dados MongoDB');
    })
    .catch((err) => {
      console.error('Erro de conexão com o banco de dados:', err);
    });
}

module.exports = connectToDatabase;