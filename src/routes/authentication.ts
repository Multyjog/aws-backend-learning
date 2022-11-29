import * as express from "express";
import { Router, Request, Response } from "express";
import { userModel } from "../models/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ITokenData } from "../middleware/auth";

const router: Router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  const emailLowerCase = email.toLowerCase();
  // Validate user input
  if (!(email && password && first_name && last_name)) {
    res.status(400).json({ message: "All inputs is required" });
  }

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await userModel.findOne({ email: emailLowerCase });
  if (oldUser) {
    return res
      .status(409)
      .json({ message: "User Already Exist. Please Login" });
  }

  //Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Create user in our database
  const user = await userModel.create({
    first_name,
    last_name,
    email: emailLowerCase,
    password: encryptedPassword,
  });

  // Create token
  const tokenData: ITokenData = {
    id: user._id.toString(),
    email: user.email,
  };
  const token = jwt.sign(tokenData, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  // save user token
  user.token = token;
  await user.save();
  // return new user
  const responseData = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    id: user._id,
    token,
  };
  res.status(201).json(responseData);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();

  if (!(email && password)) {
    res.status(400).json({ message: "All input is required" });
    return;
  }
  // Validate if user exist in our database
  const user = await userModel.findOne({ email: emailLowerCase });
  if (!user) {
    res.status(400).json({ message: "User is not found" });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: "username or Password is not correct" });
    return;
  }
  // Create token
  const tokenData: ITokenData = {
    id: user._id.toString(),
    email: user.email,
  };
  const token = jwt.sign(tokenData, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });

  // save user token
  user.token = token;

  await user.save();

  // user
  const responseData = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    id: user._id,
    token,
  };
  res.status(200).json(responseData);
});

export default router;
