import express from "express";
import User from './user-controller.js';

var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

// New User
app.post("/new-user", (req, res, next) => {
    var user = new User(req.query.user_id, req.query.user_pass, req.query.user_zip)
    user.createUser(user).then(function() {
        res.send({
            success: true,
            message: "New user created."
        })
    }).catch(function(err) {
        console.log(err)
        res.send({
            success: false,
            message: "Failed to create user with the provided input, please try again."
        })
    });
});

// Login
app.get("/login", (req, res, next) => {
    var user = new User(req.query.user_id, req.query.user_pass, req.query.user_zip)
    console.log(user.id, user.password, user.zip)
    user.validateUser(user).then(function () {
        res.send({
            success: true,
            message: "Successful Login."
        })
    }).catch(function () {
        res.send({
            success: false,
            message: "Failed to login with the provided input, please try again."
        })
    })
});
