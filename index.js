// dbName: mydbuser1
// dbPassword: ZrIKHwah8M5tpBcG

const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express()
const port = 5000;

//MiddleWare
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://mydbuser1:ZrIKHwah8M5tpBcG@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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