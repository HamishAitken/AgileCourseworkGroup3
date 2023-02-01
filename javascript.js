async function getRecipes() {
  let searchTerm = document.getElementById('formIngredients').value

  //read json file and parse
  // TODO: handle missing file
  const ingData = await fetch('ingredients.json').then((res) => res.json())

  const searchResults = ingData.data.ingredients.filter((ingredient) => ingredient.name.includes(searchTerm))

  // TODO: handle missing file
  const recData = await fetch('recipes.json').then((res) => res.json())

  // TODO: dropdown to allow user to select the ingredient (instead of using the first one)
  // TODO: handle not finding any ingredients
  const ingID = searchResults[0].id

  // TODO: handle not finding any recipes (show a message?)
  const collectedRecipes = recData.data.recipes.filter((recipe) => recipe.ingredients.find((ing) => ing.id === ingID))

  if (collectedRecipes.length == 0 ) {
    recipeContainer.innerHTML = "<p> No recipes match ingredients</p>"
  } 
  else{
    const recipeContainer = document.getElementById('recipeList')
    recipeContainer.innerHTML = ''
  
    collectedRecipes.forEach((recipe) => {
      const recipeCard = `
      <div class="col">
        <div class="card" style=" border-radius: 7px;">
          <div class="card-body shadow">
          <h5 class="card-title  text-center color-text-brownish"><b>${recipe.name}</b></h5>
          </div>
          <img src="https://picsum.photos/300/200" class="card-img-top p-1" style="border-radius: 10px;" alt="..." height="200px">
        </div>
      </div>
      `
  
      recipeContainer.innerHTML += recipeCard
    })
  }

 
}
