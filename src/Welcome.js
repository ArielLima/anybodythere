import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { auth, firestore, checkUsername } from './utils';

function Welcome(props) {

    const [username, setUsername] = useState();
    const handleSubmit = (e) => {
        setUsername(username)
        console.log(username)
        submitUsername(username)
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

async function submitUsername(username) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:3001',
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
    console.log(auth.currentUser.uid)
    var body = {
        "username": username,
        "uid": auth.currentUser.uid
    }
    instance.post("/create-username", body).then(resp => {
        console.log(resp.data)
    })
}

async function validateUsername(username) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:3001',
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
    instance.get("/validate-username", {
        params: {
            username: username
        }
    }).then(resp => {
        console.log(resp.data)
    })
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