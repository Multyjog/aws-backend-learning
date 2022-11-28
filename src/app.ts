import * as dotenv from "dotenv";
import { connect as connectToDB } from "./config/database";
import * as express from "express";
import { userModel } from "./models/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
// import { builtinModules } from "module";
import { verifyToken } from "./middleware/auth";

dotenv.config();
connectToDB();

export const app = express();

app.use(express.json());

// Register
app.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await userModel.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    await user.save();

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("All input is required");
    return;
  }
  // Validate if user exist in our database
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(400).send("User is not found");
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).send("username or Password is not correct");
    return;
  }
  // Create token
  const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
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

app.post("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
