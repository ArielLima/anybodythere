import react from 'react';
import { USERID, firestore } from '../utils.js';

function MyChats() {
    return (
        <div className="new-single-chat-button">
            <button className="new-single-chat-button" onClick={() => getAllOngoingChats("zzzz")}>Chat with someone new</button>
        </div>
    )
}

async function randomChatRequest(uid, username) {
    const randomChatRef = firestore.collection('random-chat-request');
    await randomChatRef.add({
        userID: uid,
        username: username
    })
}

async function getAllOngoingChats(uid) {
    const myChatsRef = firestore.collection('users').doc(uid);
    myChatsRef.get().then((doc) => {
        return doc.data().chats
    })
}

export default MyChats;