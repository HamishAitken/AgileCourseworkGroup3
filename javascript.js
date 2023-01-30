async function getRecipes() {
  let searchTerm = document.getElementById('ingInput').value

  //read json file and parse
  const response = await fetch('ingredients.json')
  const ingData = await response.json()

  const searchResults = ingData.data.ingredients.filter((ingredient) => ingredient.name.includes(searchTerm))

  //testing if correct ingredient is found
  document.getElementById('output').innerHTML = searchResults.map((ing) => `<div>${ing.id}: ${ing.name}</div>`)
}
