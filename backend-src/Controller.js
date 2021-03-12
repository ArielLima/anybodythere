import express from "express";
import cors from "cors";
import RandomChatRequestQueue from './RandomChatRequestQueue.js';
import bodyParser from 'body-parser';

var app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

// New User
app.post("/random-chat", jsonParser, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const userID = req.body.uid
    var reply = await new RandomChatRequestQueue().begin(userID);
    res.send(reply)
});

function callBack(reply) {
    return reply
}