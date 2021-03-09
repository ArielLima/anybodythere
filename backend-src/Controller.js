import express from "express";
import ChatJobQueue from './ChatJobQueue.js'

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// New User
app.post("/random-chat", async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const userID = req.query.uid
    var reply = await new ChatJobQueue().begin(userID);
    res.send(reply)
});

function callBack(reply) {
    return reply
}