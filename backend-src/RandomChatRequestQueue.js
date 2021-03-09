import sql from 'sqlite3';
import Queue from 'better-queue';
import events from 'events';
import RandomChatCreationQueue from './RandomChatCreationQueue.js';

let db = new sql.Database('./anybodythere.db');
let eventEmitter = new events.EventEmitter();

export default class RandomChatRequestQueue {
    constructor() {
        // Tack jobID
        this.jobID = null
    }

    /**
     * Adds user to queue of those waiting for a random chat
     * Returns name of random chat upon creation
     */
    async begin(userID) {
        // Initialize chat resquest queue
        var q = new Queue(this.proccessNewChatRequest, {
            store: {
                type: 'sql',
                dialect: 'sqlite',
                path: './chatJobsQueue.db'
            }
        });

        // push user into the queue
        q.push({ uid: userID }, function (err, result) {
            console.log("User added to chat waiting list")
        })

        // Wait for the jobID to be set - this will either be created new or retrieved from another waiting user
        var result = await new Promise((resolve) => {
            console.log("Listening for: ", "JOBID")
            eventEmitter.on("JOBID", function (reply) {
                console.log(reply)
                resolve({ id: reply })
            })
        })

        var localJobID = result.id

        console.log(localJobID)
        // Wait for job to finish - chat has been created
        var result = await new Promise((resolve) => {
            console.log("Listening for: ", localJobID)
            eventEmitter.on(localJobID, function (reply) {
                resolve({ chat_name: reply })
            })
        })

        return result
    }

    /**
     * Processes random chat requests
     * @param {object} job Contains userID, for now
     * @param {*} callback It just is
     */
    async proccessNewChatRequest(job, callback) {
        // Look for waiting users to pair with
        var reply = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM RANDOM_CHAT_QUEUE", function (err, row) {
                if (err) return reject(err)
                else return resolve(row)
            })
        });

        // Get count to see if a user was found
        var count = 0;
        var i;

        for (i in reply) {
            if (reply.hasOwnProperty(i)) {
                count++;
            }
        }

        // If no user was found, create job id and insert a record into the db
        if (count < 1) {
            console.log(job.uid, 2)
            var jobID = Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1);
            db.run("INSERT INTO RANDOM_CHAT_QUEUE (user_one, job_id) VALUES ($user_one, $job_id)", {
                $user_one: job.uid,
                $job_id: jobID
            });
            eventEmitter.emit("JOBID", jobID)
            callback("aaa")
        } else {
            // If a user was found, add job to RandomChatCreationQueue queue
            new RandomChatCreationQueue(this.jobID).addJob({
                user_one: reply[0].user_one,
                user_two: job.uid,
                id: reply[0].job_id
            }, emitDone)
            // Send new jobID created event
            eventEmitter.emit("JOBID", reply[0].job_id)
            // Remove user we are pairing with from db
            db.run("DELETE FROM RANDOM_CHAT_QUEUE WHERE job_id = $job_id", {
                $job_id: reply[0].job_id
            });
            // It just is (don't touch)
            callback("aaa")
        }
    }
}

/**
 * Sends event keyed by jobID, containing chat name from completed job
 * @param {json} reply 
 */
function emitDone(reply) {
    console.log("emiting: ", reply.id)
    setTimeout(() => eventEmitter.emit(reply.id, reply.chat_name), 0);
}