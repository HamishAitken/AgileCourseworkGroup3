const db = require('../utils/database.js')
const { withJWTRole } = require('../utils/middlewares.js')

const recipeRouter = require('express').Router()

var recipesCollection = db.getCollection('recipes');
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
//search by id
recipeRouter.post('/id', (req, res) => {
  const id = parseInt(req.body.id);
  const matchingRecipes = db.getCollection('recipes').find({ ingredients: { $elemMatch: { id: id } } });
  if(matchingRecipes.length===0){
    res.status(404).json({ error: 'No recipes found' })
  }
  else{
    res.json(matchingRecipes.map(recipeDocumentToJson));
  }
});
//search for recipes
recipeRouter.post('/search_recipes', (req, res) => {
  const search = req.body.search_value;

  const regex = new RegExp(search, "i");
 
  const matchingRecipes = recipesCollection.data.filter((recipe) => regex.test(recipe.name));
if(matchingRecipes.length===0){
  res.status(404).json({ error: 'No recipes found' })
}else{
 res.json(matchingRecipes.map(recipeDocumentToJson));
}
});



module.exports = recipeRouter
