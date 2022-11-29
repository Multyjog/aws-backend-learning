import * as mongoose from "mongoose";

export const noteSchema = new mongoose.Schema({
  owner: { type: String, default: null },
  header: { type: String },
  message: { type: String },
  created_at: { type: String },
});

export const noteModel = mongoose.model("note", noteSchema);
