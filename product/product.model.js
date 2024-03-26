import mongoose from "mongoose";

// set Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "grocery",
        "electronics",
        "furniture",
        "electrical",
        "kitchen",
        "kids",
        "sports",
        "clothes",
        "shoes",
        "auto",
        "pharmacuticals",
        "stationery",
        "cosmetics",
      ],
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    sellerId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "users",
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      minlength: 10,
    },
    image: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// create model
const Product = mongoose.model("Product", productSchema);

export default Product;
