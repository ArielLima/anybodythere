import { CreateDBConnection, EncryptPassword, GenerateSalt, ComparePassword } from '../utils.js';

// User Controller class
export default class User {
  constructor(id, password, zip) {
    this.salt = GenerateSalt()
    this.id = id;
    this.password = EncryptPassword(password, this.salt);
    this.zip = zip;
  }

  // createUser creates a new valid user, fails if user is unvalid
  async createUser() {
    var query = `INSERT INTO anybodythere.USER (user_id, user_pass, user_zip, salt) VALUES('${this.id}', '${this.password}', '${this.zip}', '${this.salt}');`
    var conn = CreateDBConnection()
    return new Promise(function (resolve, reject) {
        conn.query(query, function (error, results, fields) {
            if (error) {
                console.log(error)
                return reject(error)
            } else return resolve(results);
        });
    });
  }

  // validateUser validates that the requested users input matches the one in the database
  async validateUser() {
      // Fetch user info given the username primary key
      var query = `SELECT * FROM anybodythere.USER WHERE user_id = '${this.id}';`
      var conn = CreateDBConnection()
      return new Promise(function (resolve, reject) {
          conn.query(query, function (error, results, fields) {
              if (error) {
                  // Log error
                  console.log(error)
                  return reject(error)
              } else {
                  // Verify that the provided password matches the one in the database
                  console.log(results[0])
                  console.log(results[0].salt)
                  if (ComparePassword(this.password, results[0].user_pass, results[0].salt)) {
                    return resolve(results);
                  }
              }
          });
      });
  }
}

// const testUser = new User("test0", "0000", "00000")
// var err = testUser.createUser()
// console.log(err)