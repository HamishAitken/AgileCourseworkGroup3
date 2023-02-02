const lokijs = require('lokijs')

// TODO: replace lokijs with something like mongoose, and host the DB on a separate server
var db = new lokijs('database.db')

// The database is saved every 5 seconds. Might want to increase that
db.autosaveEnable()
db.loadDatabase(() => {
  db.getCollection('users') || db.addCollection('users')
  db.getCollection('recipes') || db.addCollection('recipes')
  db.getCollection('ingredients') || db.addCollection('ingredients')
})

module.exports = db
