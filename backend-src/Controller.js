import express from "express";
import cors from "cors";
import RandomChatRequestQueue from './RandomChatRequestQueue.js'

var app = express();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

// New User
app.post("/random-chat", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const userID = req.query.uid
    console.log(userID, 0)
    var reply = await new RandomChatRequestQueue().begin(userID);
    res.send(reply)
});

function callBack(reply) {
    return reply
}