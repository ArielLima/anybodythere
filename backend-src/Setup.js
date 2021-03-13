import sqlite from "sqlite3";
var db = new sqlite.Database("./anybodythere.db")

// Setup SQLite D
db.serialize(function () {
    db.run(`CREATE TABLE "RANDOM_CHAT_QUEUE" (user_one TEXT NOT NULL, job_id TEXT PRIMARY KEY)`);
    db.run(`CREATE TABLE "USERS" (username TEXT PRIMARY KEY, uid TEXT)`);
});
db.close();