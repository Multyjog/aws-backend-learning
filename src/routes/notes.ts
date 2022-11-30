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

  const created_at = new Date();

  // Create note in our database
  const note = await noteModel.create({
    header,
    message,
    created_at,
    owner: userData.id,
  });

  const responseData = {
    owner: userData.id,
    header,
    message,
    created_at,
    id: note._id,
  };

  await note.save();
  // return new note
  res.status(201).json(responseData);
});

// DELETE
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  // Я НЕ УВЕРЕН, ЧТО ДАННЫЙ МЕТОД ПРОВЕРЯЕТ ВТОРОЙ ПАРАМЕТР OWNER
  await noteModel.findByIdAndRemove({
    _id: req.params.id,
    owner: userData.id,
  });
  res.status(200).json({ message: "WE FOUND IT!!!" });
});

// Update
router.post("/update/:id", verifyToken, async (req: Request, res: Response) => {
  const { message, header } = req.body;
  // Validate note input
  if (!(message && header)) {
    res.status(400).json({ message: "All inputs is required" });
  }
  const userData = getTokenData(req);
  const resp = await noteModel.find({ owner: userData.id });
  const findResult = resp.find((el) => el.id === req.params.id);
  if (!findResult) {
    res.status(403).json({ message: "Hey buddy. It isnt your note" });
  }
  const updated_at = new Date();
  const updatedNote = {
    id: findResult._id,
    owner: findResult.owner,
    header,
    message,
    created_at: findResult.created_at,
    updated_at,
  };
  await noteModel.replaceOne({ _id: req.params.id }, updatedNote);
  res.status(200).json(updatedNote);

  // // НЕ НУ ЭТО ХУЙНЯ КАКАЯ-ТО. ЧТО СВЕРХУ, ЧТО СНИЗУ. ВЛАД, ПОМОГИ ПОЖАЛУЙСТА!

  // await noteModel.updateOne(
  //   { _id: req.params.id },
  //   { $set: { message, header, updated_at: new Date() } }
  // );
  // const updatedNoteData = await noteModel.find({ _id: req.params.id });
  // const responseData = {
  //   id: updatedNoteData[0]._id,
  //   owner: updatedNoteData[0].owner,
  //   header: updatedNoteData[0].header,
  //   message: updatedNoteData[0].message,
  //   created_at: updatedNoteData[0].created_at,
  //   updated_at: updatedNoteData[0].updated_at,
  // };

  // res
  //   .status(200)
  //   .json({ message: "Updated successfully. Take a look!", responseData });
});

// Get one
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = await noteModel.find({ owner: userData.id });
  const findResult = resp.find((el) => el.id === req.params.id);
  if (!findResult) {
    res.status(404).json({ message: "Not this time, mate" });
    return;
  }
  const responseData = {
    owner: findResult.id,
    header: findResult.header,
    message: findResult.message,
    created_at: findResult.created_at,
    id: findResult._id,
  };
  res.status(200).json(responseData);
});

// List
router.get("/", verifyToken, async (req: Request, res: Response) => {
  const userData = getTokenData(req);
  const resp = await noteModel.find({ owner: userData.id });
  const newResponseArr = [];
  resp.forEach((element) => {
    const editeStructureNote = {
      owner: userData.id,
      header: element.header,
      message: element.message,
      created_at: element.created_at,
      id: element._id,
    };
    newResponseArr.push(editeStructureNote);
  });
  res.status(200).json(newResponseArr);
});

export default router;
