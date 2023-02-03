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
  const recipe = recipesCollection.by(req.params.id)
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' })
  } else {
    res.json(recipeDocumentToJson(recipe))
  }
})

recipeRouter.post('/search_by_name', (req, res) => {
  const search = req.body.search_value
  if (!search || search.length() < 3) res.status(400).json({ error: 'Invalid search query' })
  const regex = new RegExp(search, 'i')

  const matchingRecipes = recipesCollection.where((recipe) => regex.test(recipe.name))
  if (matchingRecipes.length === 0) {
    res.status(404).json({ error: 'No recipes found' })
  } else {
    res.json(matchingRecipes.map(recipeDocumentToJson))
  }
})

module.exports = recipeRouter
