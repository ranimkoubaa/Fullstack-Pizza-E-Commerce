const express=require('express');
const mongoose =require("mongoose")
const dotenv =require('dotenv')
const cors = require('cors')
const app = express();
const userRouter =require("./routes/user.route")

//config dotenv
dotenv.config()
//Les cors
app.use(cors())
//BodyParser Middleware
app.use(express.json());
// Connexion à la base données
mongoose.connect(process.env.DATABASE)
.then(() => {console.log("DataBase Successfully Connected");})
.catch(err => { console.log("Unable to connect to database", err);
process.exit(); });
// requête
app.get("/",(req,res)=>{
res.send("bonjour");
});
app.listen(process.env.PORT, () => {
console.log(`Server is listening on port ${process.env.PORT}`); });
module.exports = app;
const pizzaRouter =require("./routes/pizza.route")
app.use('/api/pizzas', pizzaRouter);
const cartRouter =require("./routes/cart.route")
app.use('/api/carts', cartRouter);
const orderRouter =require("./routes/order.route")
app.use('/api/orders', orderRouter);

app.use('/api/users', userRouter);
