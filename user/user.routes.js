import express from "express";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import userValidateReqBody from "../middleware/userValidation.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// register routes
router.post(
  "/user/register",
  userValidateReqBody(registerUserValidationSchema),
  async (req, res) => {
    //extract new user from req.body
    const newUser = req.body;

    //? check if user with provided email already exists in our system
    //find user by email
    const user = await User.findOne({ email: newUser.email });

    //if user,throw error
    if (user) {
      return res.status(409).send({ message: "Email already exists." });
    }
    //just before saving user, we need to create hash password.
    const plainPassword = newUser.password;
    const saltRound = 10; //to add randomness
    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);

    //update new user password with hashedPassword.
    newUser.password = hashedPassword;

    //save user
    await User.create(newUser);

    //send res
    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);

// user login
router.post(
  "/user/login",
  userValidateReqBody(loginUserValidationSchema),
  async (req, res) => {
    // extract login credentials from req.body
    const loginCredentials = req.body;

    // find user by using email from login credentials
    const user = await User.findOne({ email: loginCredentials.email });

    // if user not found, throw new error
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // check for password match
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    // if not password match, throw error
    if (!isPasswordMatch) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // generate access token
    const payload = { email: user.email };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SIGNATURE);
    // to hide password
    user.password = undefined;

    // send response
    return res
      .status(200)
      .send({ message: "login success.", userDetails: user, Token: token });
  }
);
export default router;
