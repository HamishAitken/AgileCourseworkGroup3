const db = require('../database.js')
const adminRouter = require('express').Router()

//await fetch("http://localhost:3000/admin/recipes", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({name: "test212", ingredients: [2,3,2]})}).then((res)=> res.text())
adminRouter.post('/recipes', (req, res) => {
  const recipe = db.getCollection('recipes').insertOne(req.body)
  res.json(recipe)
})

adminRouter.get('/recipes', (_, res) => {
  res.json(db.getCollection('recipes').where(() => true))
})

adminRouter.get('/', (_, res) => {
  res.send('Admin page')
})

module.exports = adminRouter
