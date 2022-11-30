import * as express from "express";
import { Router, Request, Response } from "express";
import { INote, Note, noteModel } from "../models/Note";
import { getTokenData, verifyToken } from "../middleware/auth";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { userModel } from "../models/User";
import { create } from "domain";

const router: Router = express.Router();

// Create
router.post("/", async (req: Request, res: Response) => {
  // GET USER DATA TO ASSIGN AS OWNER
  const userData = getTokenData(req);
  if (!userData.id) {
    res
      .status(401)
      .json({ message: "You need to be authorised to create a note" });
    return;
  }
  const { message, header } = req.body;
  // Validate note input
  if (!(message && header)) {
    res.status(400).json({ message: "All inputs is required" });
  }

  const created_at = new Date().toString();

  // Create note in our database
  const note = new Note({
    owner: userData.id,
    header: header as String,
    message: message as String,
    updated_at: created_at,
    created_at,
  });

  await note.create();

  // return new note
  res.status(201).json(note.getInfo());
});

// DELETE
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = await noteModel.findById(req.params.id).exec();
  if (!resp || resp.owner !== userData.id) {
    res.status(404).json({ message: "No note found" });
    return;
  }
  await noteModel.findByIdAndRemove({
    _id: req.params.id,
  });
  res.status(204).send();
});

// Update
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const { message, header } = req.body;
  // Validate note input
  if (!(message && header)) {
    res.status(400).json({ message: "All inputs is required" });
    return;
  }
  const userData = getTokenData(req);
  const resp = await noteModel.findById(req.params.id).exec();
  if (!resp || resp.owner !== userData.id) {
    res.status(404).json({ message: "No note found" });
    return;
  }
  const updated_at = new Date();

  const note = {
    owner: resp.owner,
    header,
    message,
    created_at: resp.created_at,
    updated_at,
  };
  await noteModel.replaceOne({ _id: req.params.id }, note);
  const newNote = await noteModel.findById(req.params.id).exec();
  const responseData = {
    id: newNote._id,
    owner: newNote.owner,
    header: newNote.header,
    message: newNote.message,
    created_at: newNote.created_at,
    updated_at: newNote.updated_at,
  };
  res.status(200).json(responseData);
});

// Get one
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = (await noteModel.findById(req.params.id).exec()) as INote;
  if (!resp || resp.owner !== userData.id) {
    res.status(404).json({ message: "No note found" });
    return;
  }
  const responseData = new Note(resp).getInfo();
  res.status(200).json(responseData);
});

// List
router.get("/", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = await noteModel.find({ owner: userData.id });
  const newResponseArr = [];
  resp.forEach((element) => {
    // const editeStructureNote = {
    //   owner: userData.id,
    //   header: element.header,
    //   message: element.message,
    //   created_at: element.created_at,
    //   id: element._id,
    // };
    newResponseArr.push(new Note(element as INote).getInfo());
  });
  res.status(200).json(newResponseArr);
});

export default router;
