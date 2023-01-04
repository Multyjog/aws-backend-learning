import * as dotenv from "dotenv";
import { connect as connectToDB } from "./config/database";
import * as express from "express";
// import { userModel } from "./models/User";
// import * as bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import authentication from "./routes/authentication";
import notes from "./routes/notes";
import users from "./routes/users";

dotenv.config();
connectToDB();

export const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

app.use("/", authentication);
app.use("/notes", notes);
app.use("/users", users);

// Welcome
app.post("/welcome", verifyToken, (req, res) => {
  console.log(verifyToken);
  res.status(200).send("Welcome 🙌 ");
});
