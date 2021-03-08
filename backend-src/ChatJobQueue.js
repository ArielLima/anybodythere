import sql from 'sqlite3';
import Queue from 'better-queue';
import ProcessChatJob from './ProcessChatJob.js';

let db = new sql.Database('./anybodythere.db');
// let processQueue = new ProcessChatJob()

export default class ChatJobQueue {
    constructor(userID) {
        // Tack needed values
        this.jobID = null
        this.finalChatName = null

        // Initialize db and queue
        this.q = new Queue(this.proccessNewChatJob, {
            store: {
                type: 'sql',
                dialect: 'sqlite',
                path: './chatJobsQueue.db'
            }
        });

        // push this new user chatJob into the queue
        this.q.push(userID, function (err, result) {
            console.log("User added to chat waiting list")
        })

        new ProcessChatJob(this.jobID).getQueue().on('task_finish', function (taskID, result) {
            console.log("Waiting for chat with ID: ", jobID)
            if (taskID == jobID) {
                console.log("Chat Created")
            }
        }.bind({ jobID: this.jobID }))
    }

    async proccessNewChatJob(userID, callback) {
        console.log(userID, 3)
        var reply = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM RANDOM_CHAT_QUEUE", function (err, row) {
                if (err) return reject(err)
                else return resolve(row)
            })
        });

        var count = 0;
        var i;

        for (i in reply) {
            if (reply.hasOwnProperty(i)) {
                count++;
            }
        }

        if (count < 1) {
            console.log(userID, 2)
            // No waiting user - insert new row
            this.jobID = Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1);
            db.run("INSERT INTO RANDOM_CHAT_QUEUE (user_one, job_id) VALUES ($user_one, $job_id)", {
                $user_one: userID,
                $job_id: this.jobID
            });
            callback("aaa")
        } else {
            console.log(userID, 1)
            // Process the given job

            console.log(reply)
            console.log(reply[0].user_one, userID, reply[0].job_id)
            new ProcessChatJob(this.jobID).addJob({
                user_one: reply[0].user_one,
                user_two: userID,
                id: reply[0].job_id
            })
            // Delete 
            db.run("DELETE FROM RANDOM_CHAT_QUEUE WHERE job_id = $job_id", {
                $job_id: reply[0].job_id
            });
            callback("aaa")
        }
    }

    replySize(reply) {
        var count = 0;
        var i;

        for (i in reply) {
            if (reply.hasOwnProperty(i)) {
                count++;
            }
        }
        return count
    }
}

var q = new ChatJobQueue("qqqq")

function call(r) {
    console.log(r)
}