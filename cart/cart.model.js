import mongoose from "mongoose";

// set schema
const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    ref: "users",
    required: true,
  },
  productId: {
    type: mongoose.ObjectId,
    ref: "products",
    required: true,
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// create model
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
