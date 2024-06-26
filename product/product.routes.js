import express from "express";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/userValidation.middleware.js";
import {
  addProductValidationSchema,
  paginationValidationSchema,
} from "./product.validation.js";
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
router.post(
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
  validateReqBody(addProductValidationSchema),
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

//List product by buyer
router.post(
  "/product/list/buyer",
  isBuyer,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination from req.body
    const { page, limit, searchText } = req.body;
    // console.log(searchText);
    const skip = (page - 1) * limit;

    let match = {};

    if (searchText) {
      match = { name: { $regex: searchText, $options: "i" } };
    }
    // console.log(match);
    const products = await Product.aggregate([
      {
        $match: match,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          availableQuantity: 1,
          description: { $substr: ["$description", 0, 100] },
          image: 1,
        },
      },
    ]);

    const totalProducts = await Product.find(match).countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);
    // ceil => it round up the decimal like 3.2 vayo vane & 1 page ko limit 3 xa vane 2 page banauxa

    return res
      .status(200)
      .send({ message: "success", productList: products, totalPages });
  }
);

// list product by seller
router.post(
  "/product/list/seller",
  isSeller,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination from req.body
    const { page, limit } = req.body;

    // claculate skip
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: { sellerId: req.loggedInUserId },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          availableQuantity: 1,
          description: { $substr: ["$description", 0, 100] },
          image: 1,
        },
      },
    ]);

    // calculate page
    const totalProducts = await Product.find({
      sellerId: req.loggedInUserId,
    }).countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);

    // send res
    return res
      .status(200)
      .send({ message: "success", productList: products, totalPages });
  }
);
export default router;
