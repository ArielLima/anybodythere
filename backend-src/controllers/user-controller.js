import { CreateDBConnection, EncryptPassword, GenerateSalt, ComparePassword } from '../utils.js';

// User Controller class
export default class User {
  constructor(id, password, zip) {
    this.salt = GenerateSalt()
    this.id = id;
    this.password = password;
    this.zip = zip;
  }

  // createUser creates a new valid user, fails if user is unvalid
  async createUser(user) {
    var conn = CreateDBConnection()
    return new Promise(function (resolve, reject) {
        conn.query("INSERT INTO anybodythere.USER (user_id, user_pass, user_zip, salt) VALUES(?, ?, ?, ?)", [
            user.id,
            EncryptPassword(user.password, user.salt),
            user.zip,
            user.salt
        ],function (error, results) {
            if (error) return reject(error);
            else return resolve(results);
        });
    });
  }

  // validateUser validates that the requested users input matches the one in the database
  async validateUser(user) {
      // Fetch user info given the username primary key
      var conn = CreateDBConnection()
      return new Promise(function (resolve, reject) {
          conn.query("SELECT * FROM anybodythere.USER WHERE user_id = ?", [
            user.id
          ], function (error, results) {
              if (error) return reject(error)
              else {
                  // Verify that the provided password matches the one in the database
                  try{
                    if (ComparePassword(user.password, results[0].user_pass, results[0].salt)) {
                      return resolve(results);
                    } 
                  }catch(err) {
                    return reject(err)
                  }
            }
          });
      });
  }

  // removeUser removes a used with the given id
  async removeUser(user) {
      var conn = CreateDBConnection()
      return new Promise(function (resolve, reject) {
          conn.query("DELETE FROM anybodythere.USER WHERE user_id = ?", [
              user.id
          ], function (error, results) {
              if (error) return reject(error)
              else return resolve(results);
          });
      });
    }
}