// dbName: mydbuser1
// dbPassword: ZrIKHwah8M5tpBcG

const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = 5000;

//MiddleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('foodMaster');
        const userCollection = database.collection("users");

        // Get Api 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const users = await cursor.toArray();
            res.send(users)
        })

        // Update Api
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query)
            console.log('load user id', id);
            res.send(user)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            console.log('hitting the id:', id)
            res.send(result)
        })

        // Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);

            console.log('got new user', req.body)
            console.log('added user', result)
            res.send(result)

        })

        // Delete Api

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log('deleteing user with id', result);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello my node js...')
})

app.listen(port, () => {
    console.log('listing to port', port)
})