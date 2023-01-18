
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://burgossrodrigo:9DwdYTYuiEmQvhmx@tangle.hkje2xt.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const express = require('express')
const bodyParse = require('body-parser')
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
    'https://tvl-api.herokuapp.com/'
  ],
};

const queryTVL = async (from, to) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("tvl")
        const documents = await collection.find({}).toArray()
        let docArr = []
            if(data.time >= from && data.time <= to){
                documents.map((data) => {
                    console.log(data, 'data')
                    docArr.push({
                        tvl: data.tvl,
                        time: data.time
                    })
                })
            }        
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const queryTransactions = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("liquidity-trasactions")
        const documents = await collection.find({}).toArray()
        let docArr = []
        documents.map((data) => {
            if(data.time >= from && data.time <= to){
                docArr.push({
                    eventName: data.eventName,
                    token0: data.token0Address,
                    token1: data.token1Address,
                    symbol0: data.symol0,
                    symbol1: data.symbol1,
                    amount0: data.amount1,
                    amount1: data.amount1,
                    time: data.tine
                })                
            }            
        })
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

app.listen(PORT, server_host, () => {
    console.log(`server is listening on port: ${PORT}`)
})

router.get('/tvl/:from/:to', cors(corsOptions), async (req, res) => {
    queryTVL().then((result) => {
        return res.json(result)
    })
})

router.get('/transactions/:from/:to', cors(corsOptions), async (req, res) => {
    queryTransactions().then((result) => {
        return res.json(result)
    })
})