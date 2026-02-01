const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.use(express.json());

const connectDB = require('./config/db');
connectDB();


//----routes(for registeration login )
const authRoutes = require("./routes/authroutes")
app.use("/ecommerce/customer", authRoutes);

//----product routes to access products (admin access)
const productRoutes = require("./routes/productroutes");
app.use("/ecommerce/products",productRoutes);


const PORT = process.env.PORT||5000;
app.listen(PORT,() => console.log(`Server is running on port ${PORT}`));
