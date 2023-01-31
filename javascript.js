async function getRecipes() {
  let searchTerm = document.getElementById('ingInput').value

  //read json file and parse
  const response = await fetch('ingredients.json')
  const ingData = await response.json()

  const searchResults = ingData.data.ingredients.filter((ingredient) => ingredient.name.includes(searchTerm))

  response = await fetch('recipes.json')
  const recData = await response.json()

  const ingID = searchResults[0].id

  const collectedRecipes = recData.data.recipes.filter((recipe) => recipe.ingredients.find((element) => element.id.includes(ingID)))

  collectedRecipes.forEach(displayRecipes)

}

function displayRecipes(item) {

  const container = document.getElementById('output')
  
  
  
  // Construct card content
  const content = `
  <div class="col">
    <div class="card" style=" border-radius: 7px;">
      <div class="card-body shadow">
      <h5 class="card-title  text-center color-text-brownish"><b>${item.name}</b></h5>
      </div>
      <img src="https://picsum.photos/300/200" class="card-img-top p-1" style="border-radius: 10px;" alt="..." height="200px">
    </div>
  </div>
  `

  container.innerHTML += content
}