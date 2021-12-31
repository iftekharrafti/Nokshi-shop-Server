const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser1:06eSisrfDsG77zkF@cluster0.ts3db.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const nokshi = client.db("nokshi");
      const productsCollection = nokshi.collection("products");
      // create a document to insert

        // GET API 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        // Get single products
        app.get('/products/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const user = await productsCollection.findOne(query)
          console.log('load user with ', id);
          res.send(user)
        })

        // POST Api.... User Add
        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            console.log('added new product', newProduct);
            res.json(result)
        })

      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Nokshi design!')
})

app.listen(port, () => {
  console.log(`listening at port: ${port}`)
})