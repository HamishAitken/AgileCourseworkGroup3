const lokijs = require('lokijs')

// TODO: replace lokijs with something like mongoose, and host the DB on a separate server
var db = new lokijs('database.db')
// The database is saved every 5 seconds. Might want to increase that
db.autosaveEnable()
db.loadDatabase({}, () => {
  var recipes = db.getCollection('recipes') || db.addCollection('recipes')
  //   recipes.insertOne({ test: 'test' })
  //   db.saveDatabase()
  console.log(recipes.data)
})

module.exports = db
