var selectedItems = []

function selectIngredient(clicked_id) {
  console.log(clicked_id)
  el = document.getElementById(clicked_id)
  console.log(el.style.color)
  if (el.style.color == 'rgb(255, 255, 255)') {
    el.style.color = '#655F58'
    el.style.backgroundColor = '#B6AEAE'

    let index = selectedItems.indexOf(clicked_id)
    if (index > -1) {
      selectedItems.splice(index, 1)
    }
    console.log(selectedItems)
  } else {
    el.style.color = '#FFFFFF'
    el.style.backgroundColor = '#329E62'
    selectedItems.push(clicked_id)
    console.log(selectedItems)
  }
}
/*
function generateIngredients() {
  let groups = ['bakingGoods', 'nuts']
  for (let i = 0; i < groups.length; i++) {
    //API CALL GET INGREDIENTS
    let ingredients = [
      'Flour',
      'Baking Soda',
      'Whole Wheat Flour',
      'Granulated Sugar',
      'Brown Sugar',
      'Cocoapowder',
      'Wheat Flour',
    ]
    ingredients.push('more....')
    let elGroup = document.getElementById(groups[i])
    for (let j = 0; j < ingredients.length; j++) {
      ingredient = document.createElement('p')
      ingredient.classList.add('element-flex')
      ingredient.setAttribute('id', ingredients[j])
      ingredient.innerText = ingredients[j]
      ingredient.setAttribute('onclick', 'selectIngredient(this.id)')
      elGroup.appendChild(ingredient)
      console.log(ingredient)
    }
  }
}
*/

//just fetch some recipes may be limited to 10 recipes
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
//search for recipes using title
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

//fetch ingredients
fetch('/api/ingredients/')
  .then((res) => res.json())
  .then((data) => {
    const elements = data
    const ingredientContainer = document.getElementById('ingredients_container')
    let ingredientHTML = ''
    for (let i = 0; i < elements.length; i++) {
      if (i < 10) {
        const id = elements[i].id
        const name = elements[i].name
        const image = elements[i].image

        ingredientHTML += `
                  <p class="element-flex ing_id" value="${id}">${name}</p>
                `
      }
    }
    ingredientContainer.innerHTML = ingredientHTML

    const ingIdElements = document.querySelectorAll('.ing_id')
    ingIdElements.forEach((ingIdElement) => {
      ingIdElement.addEventListener('click', function () {
        if (!this.getAttribute('value')) {
          console.log('no value')
        }
        const id = this.getAttribute('value')
        //find a recipe using ingredients
        fetch(`/api/recipes/${id}`)
          .then((res) => res.json().then((response) => [res.status, response]))
          .then(([status_code, data]) => {
            if (status_code === 200) {
              console.log(data)
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
            }
          })
      })
    })
  })

//search for ingredients
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
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
  }
})

/*
function generateRecipes() {
  //API Call to retrieve those here
  let recipes = ['Stir Fry', 'Sweet Chili', 'Caesar Salad', 'Pizza Funghi']
  var row
  for (let i = 0; i < recipes.length; i++) {
    if (i % 2 == 0) {
      if (i != 0) document.getElementById('recipesCard').appendChild(row)
      row = document.createElement('div')
      row.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'g-5', 'mx-5')
      //The first row has more margin at the top, then the rest
      if (i == 0) row.classList.add('mt-5')
      else row.classList.add('mt-2')
      //The last row gets added an aditional Class, that adds a margin to the Last Card, so it does not overlap in the mobile version with the navbar
      if (i + 2 >= recipes.length) {
        row.classList.add('rows')
      }
    }
    let col = document.createElement('div')
    col.classList.add('col')

    let card = document.createElement('div')
    card.classList.add('card')
    card.style.borderRadius = '7px'

    let card_Body = document.createElement('div')
    card_Body.classList.add('card-body', 'shadow')

    let title = document.createElement('h5')
    title.classList.add('card-title', 'text-center', 'color-text-brownish')
    title.innerHTML = '<b>' + recipes[i] + '</b>'
    card_Body.appendChild(title)

    let img = document.createElement('img')
    img.classList.add('card-img-top')
    img.style.borderRadius = '10px'
    img.setAttribute('alt', recipes[i])
    img.setAttribute('src', 'https://picsum.photos/300/200')
    img.setAttribute('height', '200px')

    card.appendChild(card_Body)
    card.appendChild(img)
    col.appendChild(card)
    row.appendChild(col)
  }
  document.getElementById('recipesCard').appendChild(row)
}


generateIngredients()
*/

//generateIngredients();

function goToLarder() {
  try {
    document.getElementById('larder').classList.remove('d-none')
    document.getElementById('larder').classList.remove('d-sm-block')
    document.getElementById('recipes').classList.add('d-none')
    document.getElementById('recipes').classList.add('d-sm-block')
    document.getElementById('icon-larder').classList.add('active-icon')
    document.getElementById('icon-recipes').classList.remove('active-icon')
  } catch (error) {
    console.log(error)
  }
}

function goToRecipes() {
  try {
    document.getElementById('recipes').classList.remove('d-none')
    document.getElementById('recipes').classList.remove('d-sm-block')
    document.getElementById('larder').classList.add('d-none')
    document.getElementById('larder').classList.add('d-sm-block')
    document.getElementById('icon-larder').classList.remove('active-icon')
    document.getElementById('icon-recipes').classList.add('active-icon')
  } catch (error) {
    console.log(error)
  }
}
