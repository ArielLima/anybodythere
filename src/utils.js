// Imports
import mysql from 'mysql'
import CryptoJS from "crypto-js"

// Constants
const DBHOST = process.env.DBHOST
const DBUSER = process.env.DBUSER
const DBPASS = process.env.DBPASS
const DBNAME = process.env.DBNAME

export function CreateDBConnection() {
    var conn = mysql.createConnection({
        host: DBHOST,
        user: DBUSER,
        password: DBPASS,
        database: DBNAME
      });
      return conn;
}

// Public 
export function ComparePassword(decrypted, encrypted, salt) {
  console.log(salt)
  return encrypted === decryptPassword(decrypted, salt)
}

export function EncryptPassword(string, salt) {
  return CryptoJS.AES.encrypt(string, salt).toString();
}

export function GenerateSalt() {
  return  CryptoJS.lib.WordArray.random(128/8).toString();
}

// Private
function decryptPassword(encryptedString, salt) {
  console.log(salt)
  return CryptoJS.AES.decrypt(encryptedString, salt).toString(CryptoJS.enc.Utf8);
}