import React, { useRef, Component, useState } from "react";
import firebase from 'firebase/app';
import { auth, firestore, getUsername } from '../utils';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Message } from './Components/Message.js';
import Navbar from './Navbar';
import Input from "./Components/Input";

export function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy("createdAt", "desc").limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, _ } = auth.currentUser;
    const username = getUsername();
    if (formValue) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        username
      })
    }

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="Chat">
      <div>
        <ul className="Messages-list">
          {messages && messages.map(msg => <Message key={msg.id} message={msg} />).reverse()}
          <span ref={dummy}></span>
        </ul>
        <form className="message-form" onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
          <button className="send-button" type="submit" >Send</button>
        </form>
      </div>
    </div>)
}