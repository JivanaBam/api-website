import express from "express";
import { isSeller, isUser } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/userValidation.middleware.js";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
import validateIdFromReqParams from "../middleware/validate.id.middleware.js";

const router = express.Router();

// add product
// 1. logged in user must be seller
// 2. validate req.body
// 3. create product

router.post(
  "/product/add",
  isSeller,
  validateReqBody(addProductValidationSchema),

  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;

    //extract loggedInUserId
    const loggedInUserId = req.loggedInUserId;

    newProduct.sellerId = loggedInUserId;

    // create product
    await Product.create(newProduct);

    // send res
    return res.status(200).send({ message: "Product is added successfully." });
  }
);

// get product details by id
router.get(
  "/product/details/:id",
  isUser,
  validateIdFromReqParams,
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // send res
    return res
      .status(200)
      .send({ message: "success", productDetails: product });
  }
);

// delete product
router.delete(
  "/product/delete/:id",
  isSeller,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    //find product
    const product = await Product.findOne({ _id: productId });

    //if not product,throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check product ownership
    // to be product owner:  product sellerId must be equal to logged in user id
    const sellerId = product.sellerId;

    const loggedInUserId = req.loggedInUserId;

    // const isProductOwner = String(sellerId)===String(loggedInUserId)
    //alternative
    const isProductOwner = sellerId.equals(loggedInUserId);

    //if not product Owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // delete product
    await Product.deleteOne({ _id: productId });

    // send res
    return res
      .status(200)
      .send({ message: "Product is deleted successfully." });
  }
);

// assignment
// edit product
router.put(
  "/product/edit/:id",
  isSeller,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product,throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check product ownership
    // to be product owner:  product sellerId must be equal to logged in user id
    const sellerId = product.sellerId;

    const loggedInUserId = req.loggedInUserId;

    // const isProductOwner = String(sellerId)===String(loggedInUserId)
    //alternative
    const isProductOwner = sellerId.equals(loggedInUserId);

    //if not product Owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // get new values from req.body
    const newValues = req.body;

    // edit product
    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          name: newValues.name,
          brand: newValues.brand,
          price: newValues.price,
          category: newValues.category,
          freeShipping: newValues.freeShipping,
          availableQuantity: newValues.availableQuantity,
          description: newValues.description,
        },
      }
    );

    // send res
    return res
      .status(200)
      .send({ message: "Product is updated successfully." });
  }
);

export default router;
