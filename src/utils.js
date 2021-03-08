
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database'
import 'firebase/analytics';

firebase.initializeApp({
    apiKey: "AIzaSyBSHiiuYUqIBhx_cwp-zo0FjxZd5ldmn9k",
    authDomain: "anybodythere-c1963.firebaseapp.com",
    projectId: "anybodythere-c1963",
    storageBucket: "anybodythere-c1963.appspot.com",
    messagingSenderId: "568896958893",
    appId: "1:568896958893:web:4208e452c3bac89e8bf124",
    measurementId: "G-JX5GXXD2V3"
})

// Constants
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
export const BACKENDURL = "http://localhost:3000"
export const USERID = auth.currentUser;

// Exported functions
export function generateUsername() {
    localStorage.setItem("username", randomName())
}

export function getUsername() {
    return localStorage.getItem("username")
}

export function setUsername(username) {
    localStorage.setItem("username", username)
}

// Private functions
function randomName() {
    const adjectives = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
    const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + noun;
}

if (!getUsername()) {
    generateUsername()
}