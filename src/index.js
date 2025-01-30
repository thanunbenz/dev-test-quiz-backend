const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');

app.use(cors());
app.use(productRouter);
app.use(cartRouter);


const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});