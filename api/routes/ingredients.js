const db = require('../utils/database.js')
const { withJWTRole } = require('../utils/middlewares.js')

const ingredientRouter = require('express').Router()

let ingredientsCollection = db.getCollection('ingredients')
db.on('loaded', () => (ingredientsCollection = db.getCollection('ingredients')))

const ingredientDocumentToJson = (ingredient) => {
  return {
    id: ingredient.$loki,
    name: ingredient.name,
    category: ingredient.category,
    image: ingredient.image,
    store_link: ingredient.store_link,
  }
}

ingredientRouter.post('/', withJWTRole('admin'), (req, res) => {
  // TODO: validation. even thogh only authorized users can add recipes, we should probably still do some checks
  const body = req.body
  const ingredient = ingredientsCollection.insertOne({
    name: body.name,
    category: body.category,
    image: body.image,
    store_link: body.store_link,
  })
  res.json(ingredientDocumentToJson(ingredient))
})

ingredientRouter.get('/', (_, res) => {
  res.json(ingredientsCollection.data.map(ingredientDocumentToJson))
})

ingredientRouter.get('/:id', (req, res) => {
  const ingredient = ingredientsCollection.get(req.params.id)
  if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' })
  res.json(ingredientDocumentToJson(ingredient))
})

ingredientRouter.post('/search_by_name', (req, res) => {
  const input = req.body.search_term

  if (!search || search.length < 3) return res.status(400).json({ error: 'Invalid search query' })

  const regex = new RegExp(input, 'i')
  const matchingIngredients = ingredientsCollection.where((ingredient) => regex.test(ingredient.name))

  if (matchingIngredients.length === 0) {
    res.status(404).json({ error: 'No ingredients found' })
  } else {
    res.json(matchingIngredients.map(ingredientDocumentToJson))
  }
})

module.exports = ingredientRouter
