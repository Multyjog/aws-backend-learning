import * as mongoose from "mongoose";

export const noteSchema = new mongoose.Schema({
  owner: { type: String, default: null },
  header: { type: String },
  message: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
});

export class Note {
  id: String | null;
  owner: String;
  header: String;
  message: String;
  created_at: String;
  updated_at: String;

  constructor(data: INote) {
    this.id = data.id || data._id?.toString();
    this.owner = data.owner;
    this.header = data.header;
    this.message = data.message;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  getInfo() {
    return {
      id: this.id,
      owner: this.owner,
      header: this.header,
      message: this.message,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
  async create() {
    const data = this.getInfo();
    const resp = await noteModel.create(data);
    this.id = resp._id.toString();
  }
}

export interface INote {
  id?: String;
  _id?: any;
  owner: String;
  header: String;
  message: String;
  created_at: String;
  updated_at: String;
}

export const noteModel = mongoose.model("note", noteSchema);
