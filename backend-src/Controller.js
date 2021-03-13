import express from "express";
import cors from "cors";
import RandomChatRequestQueue from './RandomChatRequestQueue.js';
import bodyParser from 'body-parser';
import Users from './Users.js';

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

app.post("/create-username", jsonParser, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    console.log(req.body)
    const username = req.body.username
    const uid = req.body.uid
    if (username && uid) {
        var reply = await new Users().insertUsername(username, uid)
        console.log(reply)
        res.send(reply)
    } else {
        res.send({
            "error": "invalid username or uid"
        })
    }
})

app.get("/validate-username", jsonParser, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    console.log(req.query.uid)
    var reply = await new Users().exists(req.query.uid)
    if (!reply) {
        res.send({
            success: false,
            message: "user does not exist"
        })
    } else {
        res.send({
            success: true,
            message: "user exists",
            username: reply.username
        })
    }
})

function callBack(reply) {
    return reply
}