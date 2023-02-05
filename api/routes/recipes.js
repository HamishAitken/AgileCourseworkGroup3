const db = require('../utils/database.js')
const { withJWTRole } = require('../utils/middlewares.js')

const recipeRouter = require('express').Router()

let recipesCollection = db.getCollection('recipes')
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

recipeRouter.get('/', (_, res) => {
  res.json(recipesCollection.data.map(recipeDocumentToJson))
})

recipeRouter.get('/:id', (req, res) => {
  const recipe = recipesCollection.get(req.params.id)
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' })
  } else {
    res.json(recipeDocumentToJson(recipe))
  }
})

recipeRouter.post('/', withJWTRole('admin'), (req, res) => {
  // TODO: validation. even though only authorized users can add recipes, we should probably still do some checks
  const body = req.body
  const recipe = recipesCollection.insertOne({
    name: body.name,
    image: body.image,
    ingredients: body.ingredients,
    preparation_steps: body.preparation_steps,
  })

  if (!recipe) {
    res.status(500).json({ error: 'Could not add the recipe' })
  } else {
    res.status(201).json(recipeDocumentToJson(recipe))
  }
})

recipeRouter.put('/', withJWTRole('admin'), (req, res) => {
  const body = req.body

  const doc = recipesCollection.get(body.id)
  delete body.id
  const recipe = recipesCollection.update({ $loki: doc.$loki, meta: doc.meta, ...body })
  if (!recipe) {
    res.status(400).json({ error: 'Could not update the recipe' })
  } else {
    res.status(201).json(recipeDocumentToJson(recipe))
  }
})

recipeRouter.delete('/:id', withJWTRole('admin'), (req, res) => {
  const removed = recipesCollection.remove({ $loki: req.params.id })
  if (!removed) {
    res.status(404).json({ error: 'Recipe not found' })
  } else {
    res.sendStatus(204)
  }
})

recipeRouter.post('/search_by_ingredients', (req, res) => {
  const search = req.body.search_value

  if (!search || search.length === 0) return res.status(400).json({ error: 'Invalid search query' })

  const matchingRecipes = recipesCollection
    .chain()
    .find({ 'ingredients.length': { $lte: search.length } })
    .where((recipe) => recipe.ingredients.every((ingr) => search.includes(ingr.id)))
    .data()

  if (matchingRecipes.length === 0) {
    res.status(404).json({ error: 'No recipes found' })
  } else {
    res.json(matchingRecipes.map(recipeDocumentToJson))
  }
})

recipeRouter.post('/search_by_name', (req, res) => {
  const search = req.body.search_value
  if (!search || search.length < 3) return res.status(400).json({ error: 'Invalid search query' })

  const matchingRecipes = recipesCollection.find({ name: { $regex: [search, 'i'] } })
  if (matchingRecipes.length === 0) {
    res.status(404).json({ error: 'No recipes found' })
  } else {
    res.json(matchingRecipes.map(recipeDocumentToJson))
  }
})

module.exports = recipeRouter
