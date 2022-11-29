import * as express from "express";
import { Router, Request, Response } from "express";
import { noteModel } from "../models/Note";
import { getTokenData, verifyToken } from "../middleware/auth";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { userModel } from "../models/User";

const router: Router = express.Router();

// Create
router.post("/create", async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const { message, header } = req.body;
  // Validate note input
  if (!(message && header)) {
    res.status(400).json({ message: "All inputs is required" });
  }

  // GET USER UID TO ASSIGN AS OWNER

  const created_at = "Somewhen";

  // Create note in our database
  const note = await noteModel.create({
    header,
    message,
    created_at,
    owner: userData.id,
    // CREATED AT DATE
  });

  await note.save();
  // return new note
  res.status(201).json(note);
});

// List
router.get("/", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = await noteModel.find({ owner: userData.id });
  console.log();
  res.status(200).json(resp);
});

export default router;
