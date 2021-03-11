import react from 'react';
import { USERID, BACKENDURL, firestore } from '../utils.js';
import axios from 'axios';

function MyChats() {
    return (
        <div className="new-single-chat-button">
            <button className="new-single-chat-button" onClick={randomChatRequest}>Chat with someone new</button>
        </div>
    )
}

async function randomChatRequest() {
    await axios({
        method: "post",
        url: "http://localhost:3001/random-chat?uid=qqqq",
        header: "Access-Control-Allow-Origin",
        data: {
            uid: USERID
        }
    }).then(resp => {
        console.log(resp.data)
    })
}

async function getAllOngoingChats(uid) {
    const myChatsRef = firestore.collection('users').doc(uid);
    myChatsRef.get().then((doc) => {
        return doc.data().chats
    })
}

export default MyChats;