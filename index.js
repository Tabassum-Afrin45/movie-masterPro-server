const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://movieMaster-DB:nc9wtUH5JeAGqwgs@cluster0.9hxu1jn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Movie Master Pro is Running')
})

async function run() {
  try {
    await client.connect();
    const db = client.db('movies_db')
    const movieCollection = db.collection('movies')

    // API For All Movies
    app.get('/movies', async (req, res) => {
      const result = await movieCollection.find().toArray()
      console.log(result)
      res.send(result)
    })

    // API for Getting One Movie Details
    app.get('/movies/:id', async (req, res) => {
      const { id } = req.params
      console.log(id)
      const result = await movieCollection.findOne({ _id: new ObjectId(id) })

      res.send({
        result
      })
    })

    // API For store Movie in Database
    app.post('/movies', async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await movieCollection.insertOne(data)
      res.send({
        result
      })
    })

    // API For update a Movie
    app.put('/movies/:id', async (req, res) => {
      const { id } = req.params
      const data = req.body

      const objectId = new ObjectId(id)
      const filter = { _id: objectId }
      const update = {
        $set: data
      }
      const result = await movieCollection.updateOne(filter, update)

      res.send({
        success: true,
        result
      })
    })

    // API For Delete a Movie
    app.delete('/movies/:id', async (req, res) => {
      const { id } = req.params
      const result = await movieCollection.deleteOne({ _id: new ObjectId(id) })
      res.send({
        success: true,
        result
      })
    })

    // Latest 6 data
    app.get('/latest-movies', async (req, res) => {
      const result = await movieCollection.find().sort({
        releaseYear: -1
      }).limit(6).toArray()
      console.log(result)
      res.send(result)
    })
    // Top Rated Movies 5 data
    app.get('/top-rated', async (req, res) => {
      const result = await movieCollection.find().sort({
        rating: -1
      }).limit(5).toArray()
      console.log(result)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Movie Master Pro Server is Listening ${port}`)
})
