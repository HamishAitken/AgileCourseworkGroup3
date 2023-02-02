searchInput.addEventListener("keydown", function(event) {
        if (event.key == "Enter") {
            directRecipeSearch();
    }
});




async function directRecipeSearch() {
    let searchTerm = searchInput.value;
    const recipeContainer = document.getElementById('recipeList')

    recipeContainer.innerHTML = " "

    //read json file and parse
    const recData = await fetch('recipes.json').then((res) => res.json())
    const searchResults = recData.data.recipes.filter((recipe) => recipe.name.indexOf(searchTerm))

    if (searchResults.length == 0 ) {
        recipeContainer.innerHTML = "<p> No recipes found :( </p>"
      } 
      else{
        
        recipeContainer.innerHTML = ''
      
        searchResults.forEach((recipe) => {
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