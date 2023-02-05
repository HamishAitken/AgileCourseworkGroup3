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

ingredientRouter.get('/', (_, res) => {
  res.json(ingredientsCollection.data.map(ingredientDocumentToJson))
})

ingredientRouter.get('/:id', (req, res) => {
  const ingredient = ingredientsCollection.get(req.params.id)
  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' })
  } else {
    res.json(ingredientDocumentToJson(ingredient))
  }
})

ingredientRouter.post('/', withJWTRole('admin'), (req, res) => {
  // TODO: validation. even thogh only authorized users can add recipes, we should probably still do some checks
  const body = req.body
  const ingredient = ingredientsCollection.insertOne({
    name: body.name,
    category: body.category,
    image: body.image,
    store_link: body.store_link,
  })

  if (!ingredient) {
    res.status(500).json({ error: 'Could not add the ingredient' })
  } else {
    res.status(201).json(ingredientDocumentToJson(ingredient))
  }
})

ingredientRouter.put('/', withJWTRole('admin'), (req, res) => {
  const body = req.body
  // Can be used to update fields without removing fields which are not in the request
  // const ingredient = ingredientsCollection.updateWhere(
  //   (ingr) => ingr.$loki === body.id,
  //   (ingr) => {
  //     delete body.id
  //     return {
  //       ...ingr,
  //       ...body,
  //     }
  //   }
  // )
  const doc = ingredientsCollection.get(body.id)
  delete body.id
  const ingredient = ingredientsCollection.update({ $loki: doc.$loki, meta: doc.meta, ...body })
  if (!ingredient) {
    res.status(400).json({ error: 'Could not update the ingredient' })
  } else {
    res.status(201).json(ingredientDocumentToJson(ingredient))
  }
})

ingredientRouter.delete('/:id', withJWTRole('admin'), (req, res) => {
  const removed = ingredientsCollection.remove({ $loki: req.params.id })
  if (!removed) {
    res.status(404).json({ error: 'Ingredient not found' })
  } else {
    res.sendStatus(204)
  }
})

ingredientRouter.post('/search_by_name', (req, res) => {
  const search = req.body.search_value
  if (!search || search.length < 3) return res.status(400).json({ error: 'Invalid search query' })

  const matchingIngredients = ingredientsCollection.find({ name: { $regex: [search, 'i'] } })
  if (matchingIngredients.length === 0) {
    res.status(404).json({ error: 'No ingredients found' })
  } else {
    res.json(matchingIngredients.map(ingredientDocumentToJson))
  }
})

module.exports = ingredientRouter
