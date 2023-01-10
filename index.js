
const express = require('express')
const bodyParse = require('body-parser')
require('isomorphic-fetch');
const cors = require('cors');

const json = bodyParse.json
const app = express();
const router = express.Router()

app.use(json());
app.use(router);
const PORT = process.env.PORT || 5000
var server_host = process.env.YOUR_HOST || '0.0.0.0';
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
  ],
};

const queryTVL = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("tvl")
        const documents = await collection.find({}).toArray()
        let docArr = []
        documents.map((data) => {
            console.log(data, 'data')
            docArr.push({
                tvl: data.tvl,
                time: data.time
            })
        })
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

app.listen(PORT, server_host, () => {
    console.log(`server is listening on port: ${PORT}`)
})

router.post('/tvl', cors(corsOptions), async (req, res) => {
    queryTVL().then((res) => {
        return res.json()
    })
})