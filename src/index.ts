import * as express from "express";
import * as dotenv from "dotenv"
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid'
import * as bodyParser from 'body-parser'


dotenv.config()

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT
const client = createClient({
    database: parseInt(process.env.REDIS_DB_NUMBER || "0")
})

// MAIN
app.get("/", async (req, res) => {
    res.send("Listening...")
})

// CREATE USER
app.post('/users', async (req,res) => {
    if (!client.isReady) await client.connect();
    const user = {
        name: req.body.name || 'User',
        age: req.body.age || 0
    }
    const id = uuidv4()
    await client.set(id, JSON.stringify(user))
    res.json({ id, ...user })

})

// GET USER
app.get("/users/:id", async (req, res) => {
    if (!client.isReady) await client.connect();
    const userId = req.params.id
    const user = JSON.parse(await client.get(userId))
    res.json({ ...user, id: userId })
})

// EDIT USER
app.put("/users/:id", async (req,res) => {
    if (!client.isReady) await client.connect();
    const userId = req.params.id
    const user = {
        name: req.body.name || 'User',
        age: req.body.age || 0
    }
    await client.set(userId, JSON.stringify(user))
    res.json({ ...user, id: userId })
})

// DELETE USER
// app.delete("users/:id", async (req,res) => {
//     if (!client.isReady) await client.connect();
//     const userId = req.params.id
//     const keys = await client.keys("id")
//     console.log(keys)
//     const userToDel = keys.find(el => el == userId)
//     await client.del(userToDel)
//     res.json({ userToDel })
// })

// GET USERS
app.get("/users", async (req, res) => {
    if (!client.isReady) await client.connect();
    const keys = await client.keys("*")
    const users: Array<object> = []
    for (const key of keys) {
        const user = JSON.parse( await client.get(key) || "{}")
        users.push({ id: key, ...user })
    }
    res.json({ count: users.length, users })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})