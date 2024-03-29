const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// midleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnbwwnw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const addUsers = client.db('jobTask').collection('user')

    app.post('/user', async (req, res) => {
        const data = req.body;
        console.log(data)
        const result = await addUsers.insertOne(data);
        res.send(result)
      })

      app.get('/user',async (req,res)=>{
        const result = await addUsers.find().toArray()
        res.send(result)
      })


      app.get('/user/ka', async (req, res) => {
        try {
          // Retrieve the first payment among the first 10 in the collection
          const payment = await addUsers.find().sort({ _id: -1 }).limit(1).next();
  
          if (!payment) {
            return res.status(404).json({ error: 'No payments found' });
          }
  
          // Send the payment data as a JSON response
          res.json(payment);
        } catch (error) {
          console.error('Error retrieving payment:', error);
          res.status(500).send('Internal Server Error');
        }
      });
  


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get(('/'), (req, res) => {
    res.send('port is runring')
  })
  
  app.listen(port, () => {
    console.log(`boss is sitting ${port}`)
  })