const express = require("express");
const connectToDatabase = require("./src/database/database");
const userRouter = require('./src/router/user.router');
const productRouter = require('./src/router/product.router');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase();
app.use('/api', userRouter);
app.use('/api', productRouter);

app.get("/", (req, res) => {
  res.send("Bem-vindo ao servidor de market Place da Loja de calcados!");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  connectToDatabase();
});


