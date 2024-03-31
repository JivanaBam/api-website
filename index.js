import express from "express";
import connectDB from "./db.connect.js";
import userRoutes from "./user/user.routes.js";
import productRoutes from "./product/product.routes.js";
import cartRoutes from "./cart/cart.route.js";

const app = express();

// to make app understand json
app.use(express.json());

// Database connection
connectDB();

// Register routes
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
// network and server PORT

const PORT = process.env.API_PORT;
app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
