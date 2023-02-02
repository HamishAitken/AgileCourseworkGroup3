const recipeRouter = require('express').Router()
const db = require('../database.js')

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

recipeRouter.post('/', (req, res) => {
  // TODO: validation. even though only authorized users can add recipes, we should probably still do some checks
  const { body } = req
  const recipe = recipesCollection.insert({
    id: body.id,
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
