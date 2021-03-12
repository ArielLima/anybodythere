import react from 'react';
import { USERID, BACKENDURL, firestore, auth } from '../utils.js';
import axios from 'axios';

function MyChats() {
    return (
        <div className="new-single-chat-button">
            <button className="new-single-chat-button" onClick={randomChatRequest}>Chat with someone new</button>
        </div>
    )
}

async function randomChatRequest() {
    console.log(USERID)
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:3001',
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
    console.log(auth.currentUser.uid)
    var body = { "uid": auth.currentUser.uid }
    instance.post("/random-chat", body).then(resp => {
        console.log(resp.data)
    })
    // await axios.post("/random-chat", { Headers: { "Access-Control-Allow-Origin": "*" } }, {
    //     params: {
    //         uid: USERID
    //     }
    // }).then(resp => {
    //     console.log(resp.data)
    // })
}

async function getAllOngoingChats(uid) {
    const myChatsRef = firestore.collection('users').doc(uid);
    myChatsRef.get().then((doc) => {
        return doc.data().chats
    })
}

export default MyChats;