import sql from 'sqlite3';
import Queue from 'better-queue';
import events from 'events';
import ProcessChatJob from './ProcessChatJob.js';

let db = new sql.Database('./anybodythere.db');
let eventEmitter = new events.EventEmitter();
// let processQueue = new ProcessChatJob()

export default class ChatJobQueue {
    constructor() {

        // Tack jobID
        this.jobID = null

    }

    updateJobID(newJobID) {
        this.jobID = newJobID
    }

    async begin(userID) {

        // Initialize db and queue
        var q = new Queue(this.proccessNewChatJob, {
            store: {
                type: 'sql',
                dialect: 'sqlite',
                path: './chatJobsQueue.db'
            }
        });

        console.log(userID, this.jobID)
        // push this new user chatJob into the queue
        q.push({ uid: userID, jid: this.jobID }, function (err, result) {
            console.log("User added to chat waiting list")
        })

        // Wait for the jobID to be set
        var result = await new Promise((resolve) => {
            console.log("Listening for: ", "JOBID")
            eventEmitter.on("JOBID", function (reply) {
                console.log(reply)
                resolve({ id: reply })
            })
        })

        var localJobID = result.id

        console.log(localJobID)
        // Wait for chatJob to finish
        var result = await new Promise((resolve) => {
            console.log("Listening for: ", localJobID)
            eventEmitter.on(localJobID, function (reply) {
                resolve({ chat_name: reply })
            })
        })

        return result
    }

    async proccessNewChatJob(job, callback) {
        console.log(job.uid, 3)
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
            console.log(job.uid, 2)
            var jobID = Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1);
            // No waiting user - insert new row
            db.run("INSERT INTO RANDOM_CHAT_QUEUE (user_one, job_id) VALUES ($user_one, $job_id)", {
                $user_one: job.uid,
                $job_id: jobID
            });
            eventEmitter.emit("JOBID", jobID)
            callback("aaa")
        } else {
            console.log(job.uid, 1)
            // Process the given job

            console.log(reply)
            console.log(reply[0].user_one, job.uid, reply[0].job_id)
            // Add job to ProcessChatJob queue
            new ProcessChatJob(this.jobID).addJob({
                user_one: reply[0].user_one,
                user_two: job.uid,
                id: reply[0].job_id
            }, emitDone)
            // Reset jobID
            eventEmitter.emit("JOBID", reply[0].job_id)
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

// var q = new ChatJobQueue().begin("alima")

function call(r) {
    console.log(r)
}

function emitDone(reply) {
    console.log("emiting: ", reply.id)
    setTimeout(() => eventEmitter.emit(reply.id, reply.chat_name), 0);
}