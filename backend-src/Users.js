import sql from 'sqlite3';

let db = new sql.Database('./anybodythere.db');

export default class Users {
    constructor() { }

    async insertUsername(username, uid) {
        var reply = await new Promise((resolve, reject) => {
            db.run("INSERT INTO USERS (username, uid) VALUES ($username, $uid)", {
                $username: username,
                $uid: uid
            }, function (error) {
                if (error) {
                    console.log(error)
                    return reject(error)
                }
                return resolve({
                    success: true,
                    message: "user inserted successfully"
                })
            })

        });
        console.log(reply, 1)
        return reply
    }

    async exists(uid) {
        var reply = await new Promise((resolve, reject) => {
            db.get("SELECT username FROM USERS WHERE uid = $uid", {
                $uid: uid
            }, function (error, reply) {
                console.log(error)
                console.log(reply)
                if (error) return reject(error);
                return resolve(reply)
            })
        })
        console.log(reply, 0)
        return reply
    }
}