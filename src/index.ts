// import * as express from "express";
// import * as dotenv from "dotenv";
// import { createClient } from 'redis';
// import { v4 as uuidv4 } from 'uuid';
// import * as bodyParser from 'body-parser';
// import { UserData, User} from './models/User';

// dotenv.config()

// const app = express()
// app.use(bodyParser.json())
// const port = process.env.PORT
// const client = createClient({
//     database: parseInt(process.env.REDIS_DB_NUMBER || "0")
// })

// // MAIN
// app.get("/", async (req, res) => {
//     res.send("Listening...")
// })

// // CREATE USER
// app.post('/users', async (req,res) => {
//     if (!client.isReady) await client.connect();
//     const user = new UserData(req.body.name, req.body.age)
//     const id = uuidv4()
//     await client.set(id, JSON.stringify(user))
//     res.json({ id, ...user })

// })

// // GET USER
// app.get("/users/:id", async (req, res) => {
//     if (!client.isReady) await client.connect();
//     const userId = req.params.id
//     const user = JSON.parse(await client.get(userId))
//     res.json({ ...user, id: userId })
// })

// // EDIT USER
// app.put("/users/:id", async (req,res) => {
//     if (!client.isReady) await client.connect();
//     const userId = req.params.id
//     const user = new UserData(req.body.name, req.body.age)
//     await client.set(userId, JSON.stringify(user))
//     res.json({ ...user, id: userId })
// })

// // DELETE USER
// app.delete("/users/:id", async (req,res) => {
//     if (!client.isReady) await client.connect();
//     const userId = req.params.id
//     await client.del(userId)
//     res.json({ id: userId })
// })

// // GET USERS
// app.get("/users", async (req, res) => {
//     if (!client.isReady) await client.connect();
//     const keys = await client.keys("*")
//     const users: Array<User> = []
//     for (const key of keys) {
//         const data = JSON.parse( await client.get(key) || "{}")
//         const user = new User(data.name, data.age)
//         user.id = key
//         users.push(user)
//     }
//     res.json({ count: users.length, users })
// })

// app.listen(port, () => {
//     console.log(`http://localhost:${port}`)
// })
import * as http from "http";
import { app } from "./app";
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
