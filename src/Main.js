import React, { useRef, useState } from 'react';
import './index.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { auth, firestore } from './utils';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { ChatRoom } from './Chat/ChatRoom.js';
import Map from './Map/Map';


function App() {

  const [user] = useAuthState(auth);

  const Home = (
    <div>
      <div className="header">
        <h1>anybody there</h1>
      </div>
      <div className="container">
        <Map />
        <ChatRoom />
      </div>

    </div>
  );

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>


      <section>
        {user ? Home : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;