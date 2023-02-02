const db = require('../utils/database.js')
const { withJWTRole } = require('../utils/middlewares.js')

const recipeRouter = require('express').Router()

var recipesCollection = db.getCollection('recipes')
db.on('loaded', () => (recipesCollection = db.getCollection('recipes')))

const recipeDocumentToJson = (recipe) => {
  return {
    id: recipe.$loki,
    name: recipe.name,
    image: recipe.image,
    ingredients: recipe.ingredients,
    preparation_steps: recipe.preparation_steps,
  }
}

recipeRouter.post('/', withJWTRole('admin'), (req, res) => {
  // TODO: validation. even though only authorized users can add recipes, we should probably still do some checks
  const body = req.body
  const recipe = recipesCollection.insert({
    name: body.name,
    image: body.image,
    ingredients: body.ingredients,
    preparation_steps: body.preparation_steps,
  })
  res.json(recipeDocumentToJson(recipe))
})

recipeRouter.get('/', (_, res) => {
  res.json(recipesCollection.data.map(recipeDocumentToJson))
})

recipeRouter.get('/:id', (req, res) => {
  const recipe = recipesCollection.get(req.params.id)
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' })
  res.json(recipeDocumentToJson(recipe))
})

module.exports = recipeRouter
