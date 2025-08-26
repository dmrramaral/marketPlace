const express = require("express");
const connectToDatabase = require("./src/database/database");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase();

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


