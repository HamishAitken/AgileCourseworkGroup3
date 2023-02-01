const lokijs = require('lokijs')
const bcrypt = require("bcrypt")
// TODO: replace lokijs with something like mongoose, and host the DB on a separate server
var db = new lokijs('database.db')
// The database is saved every 5 seconds. Might want to increase that
db.autosaveEnable()
db.loadDatabase({}, () => {
  var recipes = db.getCollection('recipes') || db.addCollection('recipes');
  var users = db.getCollection('users') || db.addCollection('users');
  //   recipes.insertOne({ test: 'test' })
  //   db.saveDatabase()
  bcrypt.hash("test123", 10).then((hash) => {
    // users.insertOne({
    //   username: "admin",
    //   password: hash
    // })
    console.log(users.data)
  })
})

module.exports = db
