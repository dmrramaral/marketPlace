const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./src/database/database");
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

app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:4200',
    methods: ['GET','POST','DELETE','UPDATE','PUT']
  }
));



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


