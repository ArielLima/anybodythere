import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import firebase from 'firebase/app';
import { auth, firestore } from './utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import Chat from './Chat/Chat';
import Map from './Map/Map';

function App() {
  const [user] = useAuthState(auth);

  var Pop = (<div></div>)
  if (user) {
    detectPresence();
    // Pop = (
    //   <Popup trigger={usernameExists()} position="center center">
    //     <div>Popup content here !!</div>
    //   </Popup>
    // )
  }

  const Home = (
    <div>
      <div className="header">
        <h1>anybody there</h1>
      </div>
      <div className="container">
        {/* <Pop /> */}
        <Map />
        <Chat />
      </div>

    </div>
  );

  return (
    <div className="App">
      <header>
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

async function usernameExists() {
  // Fetch the current user's ID from Firebase Authentication.
  const { uid, _ } = auth.currentUser;

  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userCollectionRef = firestore.collection("users").doc("qqqq")

  // Check if the user has a defined username
  console.log("HHHHHH")
  var reply = await userCollectionRef.get().then((doc) => {
    if (!doc.data().username) {
      return false
    }
    return true
  })
  return reply
}

function detectPresence() {

  // Fetch the current user's ID from Firebase Authentication.
  const { uid, _ } = auth.currentUser;

  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  firebase.database().ref('.info/connected').on('value', function (snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
      return;
    };

    // If we are currently connected, then use the 'onDisconnect()'
    // method to add a set which will only trigger once this
    // client has disconnected by closing the app,
    // losing internet, or any other means.
    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
      // The promise returned from .onDisconnect().set() will
      // resolve as soon as the server acknowledges the onDisconnect() 
      // request, NOT once we've actually disconnected:
      // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

      // We can now safely set ourselves as 'online' knowing that the
      // server will mark us as offline once we lose connection.
      userStatusDatabaseRef.set(isOnlineForDatabase);

      // Now Real Time Database with Firestore
      var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

      // Firestore uses a different server timestamp value, so we'll
      // create two more constants for Firestore state.
      var isOfflineForFirestore = {
        state: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      var isOnlineForFirestore = {
        state: 'online',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      firebase.database().ref('.info/connected').on('value', function (snapshot) {
        if (snapshot.val() == false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'
          userStatusFirestoreRef.set(isOfflineForFirestore);
          return;
        };

        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);

          // We'll also add Firestore set here for when we come online.
          userStatusFirestoreRef.set(isOnlineForFirestore);
        });
      });

    });
  });

  function syncPresenceWithFirestore() {
  }
}

export default App;