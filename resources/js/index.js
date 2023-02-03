

// just fetch some recipes may be limited to 10 recipes
fetch('/api/recipes/')
  .then((res) => res.json())
  .then((data) => {
    const recipe_card = document.getElementById('recipesCard')
    let recipeHTML = ''
    for (const element of data) {
      const id = element.id

      recipeHTML += `

              <a href="/details_page.html?id=${id}">
               <div class="col h-100">
              <div class="card" style="border-radius:7px;">
              <div class="card-body shadow">
              <h5 class="card-title text-cente color-text-brownish">${element.name}</h5>
              <img id="image" src="${element.image}" alt="${element.title}" class="card-img-top" 
              style="border-radius:10px; 
            height:200px;
              object-fit: cover;
              object-position: center;
              "
              >
              </div>
              </div>
               </div>
       </div>
          </a>
               `
    }
    recipe_card.innerHTML = recipeHTML
    const image = document.getElementById('image')
    if (image.src === '') {
      image.src = 'https://www.floatex.com/wp-content/uploads/2016/04/dummy-post-horisontal.jpg'
    }
  })
const search_recipes = document.getElementById('search_recipes')
/*
search for recipes using the title of the recipe

*/
search_recipes.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const search_value = search_recipes.value
    search_recipes.value = ''

    fetch('/api/recipes/search_by_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_value,
      }),
    })
      .then((res) => res.json().then((response) => [res.status, response]))
      .then(([status_code, data]) => {
        // TODO: better error message (show a special text?)
        if (status_code === 200) {
          const recipe_card = document.getElementById('recipesCard')
          let recipeHTML = ''

          for (const element of data) {
            recipeHTML += `
                    <a href="/details_page.html?id=${element.id}">
                    <div class="col h-100">
                    <div class="card" style="border-radius:7px;">
                    <div class="card-body shadow">
                    <div class="card-title">${element.name}</div>
                    <img id="image" src="${element.image}" alt="${element.title}" class="card-img-top"
                    style="border-radius:10px;
                    height:200px;
                    object-fit: cover;
                    object-position: center;
                    ">
                    </div>
                    </div>
                    </div>
                    </a>

                 
                 `
            recipe_card.innerHTML = recipeHTML
          }
        } else {
          alert('No recipes found!')
        }
      })
  }
})

// fetch ingredients
fetch('/api/ingredients/')
  .then((res) => res.json())
  .then((data) => {
    const elements = data
    const ingredientContainer = document.getElementById('ingredients_container')
    let ingredientHTML = ''
    for (let i = 0; i < elements.length; i++) {
      if (i < 15) {
        const id = elements[i].id
        const name = elements[i].name
       

        ingredientHTML += `
                  <p class="element-flex ing_id" value="${id}">${name}</p>
                `
      }
    }
    ingredientContainer.innerHTML = ingredientHTML

    let selectedIngredientIds = [];
    const ingIdElements = document.querySelectorAll('.ing_id');

    ingIdElements.forEach((ingIdElement) => {
      ingIdElement.addEventListener('click', function () {
        if (!this.getAttribute('value')) {
          alert('no value');
          return;
        }
       
        const id = this.getAttribute('value');
        const index = selectedIngredientIds.indexOf(id);
        if (index === -1) {
          selectedIngredientIds.push(id);
          this.style.backgroundColor = 'green';
        } else {
          selectedIngredientIds.splice(index, 1);
          this.style.backgroundColor = '';
        }
        //convert search ingredient to object?
       let search_value=selectedIngredientIds.map(Number);
       
  

        
        // find a recipe using ingredients
        fetch(`/api/recipes/search_by_ingredients`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search_value
          }),
        })
          .then((res) => res.json().then((response) => [res.status, response]))
          .then(([status_code, data]) => {
            if (status_code === 200) {
             
              const recipe_card = document.getElementById('recipesCard')
              let recipeHTML = ''
              for (const element of data) {
                console.log(element)
                recipeHTML += `
                    <a href="/details_page.html?id=${element.id}">
                    <div class="col h-100">
                    <div class="card" style="border-radius:7px;">
                    <div class="card-body shadow">
                    <div class="card-title">${element.name}</div>
                    <img id="image" src="${element.image}" alt="${element.title}" class="card-img-top"
                    style="border-radius:10px;
                    height:200px;
                    object-fit: cover;
                    object-position: center;
                    ">
                    </div>
                    </div>
                    </div>
                    </a>
                    `
                recipe_card.innerHTML = recipeHTML
              }
             
            }
            else{
                console.log('not found');
            }
          })
      })
    })
  })

// search for ingredients
const search_ingredients = document.getElementById('search_ingredients')
search_ingredients.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const search_term = search_ingredients.value
    document.getElementById('search_ingredients').value = ''
    fetch('/api/ingredients/search_by_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_term,
      }),
    })
      .then((res) => {
        const result=res.status;
        return res.json().then((response) => [result, response])
      })
      .then(([result, response]) => {
      
        if (result===400) {
          alert('invalid search query')
        }
        else if(result===404){
          alert('No ingredients found');
        }
        else{
          const data=response;
          const ingredientContainer = document.getElementById('ingredients_container')
          let ingredientHTML = '';
          for (const element of data) {
            const id = element.id
            const name = element.name
            ingredientHTML += `
                  <p class="element-flex ing_id" value="${id}">${name}</p>
                `
          }
          ingredientContainer.innerHTML = ingredientHTML;

          


        }

      })
      
    }})