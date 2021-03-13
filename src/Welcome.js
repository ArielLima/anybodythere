import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { auth, firestore, setUsername } from './utils';

function Welcome(props) {

    const [username, setUsername] = useState();
    const handleSubmit = (e) => {
        setUsername(username)
        console.log(username)
        addUserDoc(username)
        props.onSubmit()

        e.preventDefault();
    }

    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label style={{ marginRight: '8px' }}>Please enter a username:</label>
                    <input type="text" onChange={e => setUsername(e.target.value)} value={username} />
                    <input type="submit" value="Go" />
                </form>
            </div>
        </div>
    )

}

function addUserDoc(username) {
    console.log("Trying to add user doc...")
    // Fetch the current user's ID from Firebase Authentication.
    const { uid, _ } = auth.currentUser;

    firestore.collection('users').doc(uid).set({
        username: username
    }).then(() => {
        console.log("User doc created")
    }).catch(function (err, res) {
        console.log(err)
    });
}

export default Welcome