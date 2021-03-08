import Queue from 'better-queue';
import admin from 'firebase-admin';

// Firestore connection
admin.initializeApp({
    credential: admin.credential.cert(
        {
            "type": "service_account",
            "project_id": "anybodythere-c1963",
            "private_key_id": "0701df81fbdfb2802df164de76687c87fcbc74df",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCLYVqBQk/wWJbZ\n8B7knAPcpsP5qbUqYxhXcyQzkvRKm1dIeTdKi9JtGT0ksA43YLnlMCyyHsUE7xGr\ntIImjDwgU6ysUZ1b2wyikdfASB9SKwq3Jhc4c1LtWj+9UALB43aZBrVgG1MNqnMe\nuHRaoQ/wpYvNjKxymKhlwViQlCVX/dZb5esCkTLa7PSQqTO0h7HzPqdLr7aTcAw/\npMxhF8YiNOexx1PClsAR0cqJMeLotVhJ58NLTGwrpDF7s34+JHqOrgX1SZx4+IUm\n6sCVkMyyT100PGTKZdfs0xmwW3Cm3ziNEGpNmc9/RQ8GTV5/zD4Azq0NxtzJWsaY\n91mF7TvtAgMBAAECggEABZ/Ji6K14BBrEeM/E+F5xGsUSFxBO7Mg9dJnGQ+qfOI0\nzO9bPE5VEOLuVS8ne7OS/L0LaKqWL6NH9sJDaDPLb1CBDLkEXQMDSQISjyc54FJt\nTcOjNztsErjMDqMOYW2AyR78raKcoNYKbChsRYXvQzoi4In3IW6oiOaa4MahlSHR\nRacYRiTHuh0BbQqB+2juRHhq7KgBdQCBVJ6LPq1+mcPf91TG7gvmprcRWLpZVTOk\nDeZ7kdcOjDD2QZgN+fftziUOkE+dqeNQEJB4BP9groU+3vgK0/p/k1ptsfd5up7R\nn+Y3ejf49ohWHg1RM4lv849q8mpAFPweAlF9D8nFAQKBgQDEJrQT5bKlxH7nMvMs\ndSEUGTP9DdY8sat5wdVe/iMLUsiohfTPm3f26rKstbAvwIfCa80yRml2W9ino480\nWdijyKQvCM7zUudoZ+vWMmfOxXe9NwYQc8/7mTBQLARO6iug8Q1/Dev7Tf5/hFXZ\n4xKdQmRgpSwNqhm+bndhxJ9+bQKBgQC16EvW5WUfRePcFoSCrn4fe5c8UA45Q5e4\nL1BV/Jw5KeOiCYepMpulCI735gabVozRAuLPVH8FLfwwGdeQaWlvSEEL44HgCV3V\np6mfXfFP1PBFsq5WqNZ4+Jc23jT9O4LTzQKLLSVREe4p0z2g5K+cGPC2Cekf1Z1i\nWIfedlhDgQKBgGFWe4JsOCz+x6Lfq8DiFxosL5piJXBVEq0HPWU4ZBeYay8F2qiz\nk+KaMTR3rQjlV/lpGZjbTDaJ+YenKMdn1pPgW2ljy58AAwnSmDvhI5Z+c58YERBV\nCF7odAs07KZkmmXxeSsVs4cv+x04hIntny0e50T2clgNk1zm4KNJuYQ5AoGBAKkF\n2oooBkkDqNCUv7WpqxlXvlPVUxIUY0JJ/EyZdxOKf6/NSReHJaY4CJgBTXxC9H81\nPkhFi+zlKKINMQZHXCeBrKb+U2w3Z9AhhPPG13VFN6ibeXCeWwJ2ghMCb5wpEsv4\nfveREE5+6ZxFYstAEohpiCitlsb0ttNtzXmA30yBAoGBAL45uvRPuOOwih66gk8I\n8UmbLpn/Bj5PrjH4Ur5s1XMk+I/Gj9qZYhGKkfSfChkyTL2g9yg+UKI5S+h6WyXr\nt9Np1r2P8qRO67hLSdv9rE9UxgBqCOCnyR2+eYD2xcs0RuDBRjK1dJ5WHMRH4x2Y\nXGNu2iTKxsvkNygehMM3c6hX\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-mkug0@anybodythere-c1963.iam.gserviceaccount.com",
            "client_id": "116459621004138602287",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mkug0%40anybodythere-c1963.iam.gserviceaccount.com"
        })
});

const dbf = admin.firestore();

export default class ProcessChatJob {
    constructor(jobID) {
        // Initialize queue
        this.q = new Queue(this.proccessNewChatJob, {
            id: jobID,
            store: {
                type: 'sql',
                dialect: 'sqlite',
                path: './processChatJobQueue.db'
            }
        });
    }

    getQueue() {
        return this.q
    }

    addJob(job) {
        this.q.push(job)
    }

    async proccessNewChatJob(job, callback) {
        let chatName = job.user_one + '.' + job.user_two

        // create firestore collection for new private chat
        const newChatRef = dbf.collection(chatName)
        await newChatRef.add({
            text: "Welcome to a new random chat! Be nice!",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            uid: "admin",
            username: "admin"
        })

        // Update the docs of each user in firestore
        // addNewChatToFirestoreUser(job.user_one, chatName)
        // addNewChatToFirestoreUser(job.user_two, chatName)
        callback("aaa")
    }

    addNewChatToFirestoreUser(uids, chatName) {
        const userRef = dbf.collection('users').doc(uids);
        userRef.update({
            chats: admin.firestore.FieldValue.arrayUnion(chatName)
        }).catch(function (err, res) {
            console.log(err)
        });
    }
}