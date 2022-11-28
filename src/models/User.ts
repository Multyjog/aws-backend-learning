import * as mongoose from "mongoose";

// export class UserData {
//     name: string 
//     age: number

//     constructor(name: string = 'User', age: number = 0) {
//         this.name = name
//         this.age = age
//     }
//     getInfo() {
//         return `${this.name} - ${this.age} y.o.`
//     }
// }

// export class User extends UserData {
//     id: string

//     constructor(id: string, name: string = 'User', age: number = 0) {
//         super(name, age)
//         this.id = id
//         // this.name = name
//         // this.age = age
//     }
// }

export const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

export const userModel = mongoose.model("user", userSchema); 