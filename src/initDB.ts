import * as dotenv from "dotenv";
import * as mongoose from "mongoose";

import { connect as connectToDB } from "./config/database";

import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { noteModel } from "./models/Note";
import { userModel } from "./models/User";

dotenv.config();

const main = async () => {
  await connectToDB();
  await userModel.collection.drop();
  await noteModel.collection.drop();
  await userModel.createCollection();
  await noteModel.createCollection();

  const user = await userModel.create({
    first_name: "test",
    last_name: "test",
    email: "test@gmail.com",
    password: await bcrypt.hash("123", 10),
    role: "admin",
  });

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "24h",
    }
  );
  user.token = token;
  await user.save();

  await noteModel.create({
    header: "Initial Note Header",
    message: "Initial Note Message",
    owner: user._id,
  });

  console.log("Vse Horosho");
};

main();
