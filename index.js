require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// create the express application:
const app = express();
const port = process.env.PORT || 5000;

// middlewares:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fev0e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

      // create database and data collections:
      const db = client.db('marathon_hub');
      const marathonsCollection = db.collection('marathons'); // a collection of all of the marathons events
      const marathonRegistrationCollection = db.collection('marathon_registrations'); // the collections of all of the marathon event applications
      const usersCollection = db.collection('users'); // the collections of the users;

      // add a marathon
      app.post('/marathons/add', async ( req, res) => {
         const marathonData = req.body;
         const finalData = {...marathonData, createdAt: new Date()}
         const result = await marathonsCollection.insertOne(finalData);
         res.send(result);
      })

      // get marathons
      app.get('/marathons', async (req, res) => {
         let size = 0;
         const filter = {};

         if(req.query.count) {
            size = parseInt(req.query.count);
         }

         if(req.query.id) {
            filter._id = new ObjectId(req.query.id);
         }

         const data = await marathonsCollection.find(filter).limit(size).toArray();
         res.send(data);
      })



      // get all marathons of a specific user
      app.get('/marathons/:email', async (req, res) => {
         const email = req.params.email;
         const query = {'userInfo.email': email};
         const result = await marathonsCollection.find(query).toArray();
         res.send(result);
      })

      app.put('/marathons/update/:id', async (req, res) => {
         const data = req.body;
         const marathonId = req.params.id;
         const filter = {_id : new ObjectId(marathonId)};
         const updatedDoc = {
            $set: {...data}
         }
         const options = { upsert: true}
         console.log(data)

         const result = await marathonsCollection.updateOne(filter, updatedDoc, options );
         res.send(result);
      });

      app.delete('/marathons/delete/:id', async (req, res) => {
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)};
         const result = await marathonsCollection.deleteOne(filter);
         res.send(result);
      })

      app.post('/marathon-registrations', async (req, res) => {
         const data = req.body;

         // check if the user has applied to this event
         const userEmail = data.email;
         const applicationFilter = { email : userEmail };
         const userApplication = await marathonRegistrationCollection.findOne(applicationFilter)
         if (userApplication) {
            return res.send({
               message: 'NOT ALLOWED'
            })
         }

         // save the application to application or marathon registration collection in DB:
         const result = await marathonRegistrationCollection.insertOne(data, {upsert: true});

         // increase the registrationCount:
         const filter = {_id : new ObjectId(data.marathonId)};
         const doc = {
            $inc: {
               registrationCount : 1
            }
         }
         const updateRegistrationCount = await marathonsCollection.updateOne(filter, doc)

         // send result to the client
         res.send(result);
      })

      app.put('/marathon-registrations/update/:id', async (req, res) => {
         const id = req.params.id;
         const data = req.body;
         const filter = {_id: new ObjectId(id)};
         const updatedDoc = {
            $set: {
               ...data, updatedAt: new Date()
            }
         }
         const options = { upsert : true};
         const result = await marathonRegistrationCollection.updateOne(filter, updatedDoc, options)
         res.send(result);
      })

      app.delete('/marathon-registrations/delete/:id', async (req, res) => {
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)};
         const application = await marathonRegistrationCollection.findOne(filter);
         
         // 1. decrease the registrationCount:
         const marathonId = application.marathonId;
         const marathonFilter = {_id : new ObjectId(marathonId)};
         const updatedDoc = {
            $inc: {
               registrationCount : -1
            }
         }
         const dereaseRegistration = await marathonsCollection.updateOne(marathonFilter, updatedDoc);

         // 2. delete the applications
         const result = await marathonRegistrationCollection.deleteOne(filter);

         res.send(result);
      });

      app.get('/marathon-registrations', async (req, res) => {
         const result = await marathonRegistrationCollection.find().toArray();
         res.send(result);
      })

      app.get('/marathon-registrations/:id', async (req, res) => {
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)};
         const result = await marathonRegistrationCollection.findOne(filter);
         res.send(result);
      })

      app.get('/marathon-registration/:email', async (req, res) => {
         const userEmail = req.params.email;
         const filter = {email : userEmail}
         const result = await marathonRegistrationCollection.find(filter).toArray();
         res.send(result);
      })

      app.post('/users/add', async (req, res) => {
         const data = req.body;
         const result = await usersCollection.insertOne(data);
         res.send(result);
      })

      app.get('/users', async (req, res) => {
         const result = await usersCollection.find().toArray();
         res.send(result);
      })

      app.get('users/:id', async (req, res) => {
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)};
         const result = await usersCollection.findOne(filter);
         res.send(result);
      })


      app.get('/', (req, res) => {
         res.send('Serever is running....')
      })


      
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);



// listen the sever:
app.listen(port, () => {
   console.log(`Marathon Hub Server is running on port: ${port}`);
})