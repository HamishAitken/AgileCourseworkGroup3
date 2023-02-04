const recipeTemplate = (element) => `
<a href="/details_page.html?id=${element.id}">
  <div class="col h-100">
    <div class="card" style="border-radius:7px;">
      <div class="card-body shadow">
        <h5 class="card-title text-cente color-text-brownish">${element.name}</h5>
        <img 
          id="image"
          src="${element.image}"
          alt="${element.title}"
          class="card-img-top"
          style="border-radius:10px;height:200px;object-fit: cover;object-position: center;"
        >
        </div>
      </div>
    </div>
  </div>
</a>
`

// just fetch some recipes may be limited to 10 recipes
// TODO: this currently fetches ALL recipes, should update API to allow fetching for less
fetch('/api/recipes/')
  .then((res) => res.json())
  .then((data) => {
    const recipe_card = document.getElementById('recipesCard')
    let recipeHTML = ''
    for (const element of data) {
      recipeHTML += recipeTemplate(element)
    }
    recipe_card.innerHTML = recipeHTML
    const image = document.getElementById('image')
    if (image.src === '') {
      image.src = 'https://www.floatex.com/wp-content/uploads/2016/04/dummy-post-horisontal.jpg'
    }
  })

const search_recipes = document.getElementById('search_recipes')
// search for recipes using the title of the recipe
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
            recipeHTML += recipeTemplate(element)
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
      // TODO: add ingredients to categories. why is this "< 15" ?
      if (i < 15) {
        const id = elements[i].id
        const name = elements[i].name

        ingredientHTML += `
                  <p class="element-flex ing_id" value="${id}">${name}</p>
                `
      }
    }
    ingredientContainer.innerHTML = ingredientHTML

    const selectedIngredientIds = []
    const ingIdElements = document.querySelectorAll('.ing_id')

    ingIdElements.forEach((ingIdElement) => {
      ingIdElement.addEventListener('click', function () {
        if (!this.getAttribute('value')) {
          alert('no value')
          return
        }

        const id = this.getAttribute('value')
        // TODO: refactor, wtf is this. pretty sure it does not use actual recipe id
        const index = selectedIngredientIds.indexOf(id)
        if (index === -1) {
          selectedIngredientIds.push(id)
          this.style.backgroundColor = 'green'
        } else {
          selectedIngredientIds.splice(index, 1)
          this.style.backgroundColor = ''
        }

        // convert search ingredient to object?
        const search_value = selectedIngredientIds.map((id) => parseInt(id))

        // TODO: extract to a function. add click handler for "search" button which uses this
        // find a recipe using ingredients
        fetch('/api/recipes/search_by_ingredients', {
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
            if (status_code === 200) {
              const recipe_card = document.getElementById('recipesCard')
              let recipeHTML = ''
              for (const element of data) {
                recipeHTML += recipeTemplate(element)
                recipe_card.innerHTML = recipeHTML
              }
            } else {
              // TODO:
              console.log('not found')
            }
          })
      })
    })
  })

// search for ingredients
const search_ingredients = document.getElementById('search_ingredients')
// TODO: Extract handler to function, add it as a button click handler
search_ingredients.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const search_value = search_ingredients.value
    document.getElementById('search_ingredients').value = ''
    fetch('/api/ingredients/search_by_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_value,
      }),
    })
      .then((res) => res.json().then((response) => [res.status, response]))
      .then(([result, response]) => {
        // TODO: Better way to notify of error (not alert). Should NOT use alerts ANYWHERE
        if (result === 400) {
          alert('invalid search query')
        } else if (result === 404) {
          alert('No ingredients found')
        } else {
          const data = response
          const ingredientContainer = document.getElementById('ingredients_container')
          let ingredientHTML = ''
          for (const element of data) {
            const id = element.id
            const name = element.name
            ingredientHTML += `
                  <p class="element-flex ing_id" value="${id}">${name}</p>
                `
          }
          ingredientContainer.innerHTML = ingredientHTML
        }
      })
  }
})

function removeFromShoppingCart(element) {
  // Get the Text of the <p> Element of the List where the button was clicked.
  const text = element.previousElementSibling.innerText
  const cart = JSON.parse(localStorage.getItem('cart'))
  const index = cart.indexOf(text)
  if (index > -1) cart.splice(index, 1)

  element.parentElement.parentElement.remove()
  localStorage.setItem('cart', JSON.stringify(cart))
  if (cart.length === 0) localStorage.removeItem('cart')
}

/**
 * Generates the shopping cart html in following format:
 * <li class="mb-2">
        <div class="d-flex flex-row flex-row-table align-content-start ">
            <p class="mb-1 align-self-center"><<INGREDIENT>></p>
            <button type="button" onclick="removeFromShopnpingCart(this)" class="btn btn-outline-success ms-auto p-2" data-toggle="tooltip" data-placement="top" title="Add to Shopping List"></button>
        </div>
   </li>
 */
function generateShoppingCart() {
  const shopping = document.getElementById('shopping-list')
  const shopping_mobile = document.getElementById('shopping-list-mobile')
  const ul = document.createElement('ul')
  const cart = JSON.parse(localStorage.getItem('cart'))
  if (cart === null || cart.legnth === 0) {
    const par = document.createElement('p')
    par.innerText = 'The Shopping-list appears to be empty'
    par.classList.add('ms-4')
    shopping.appendChild(par)
    shopping_mobile.appendChild(par)
    return
  }
  for (let i = 0; i < cart.length; i++) {
    const li = document.createElement('li')
    li.classList.add('mb-2')

    const div = document.createElement('div')
    div.classList.add('d-flex', 'flex-row', 'flex-row-table', 'align-content-start')

    const p = document.createElement('p')
    p.classList.add('mb-1', 'align-self-center')
    p.innerText = cart[i]

    const button = document.createElement('button')
    button.classList.add('btn', 'btn-outline-danger', 'ms-auto', 'p-2')
    button.setAttribute('type', 'button')
    button.setAttribute('data-toggle', 'tooltip')
    button.setAttribute('data-placemen', 'top')
    button.setAttribute('title', 'Remove from shoppping-list')
    button.setAttribute('onclick', 'removeFromShoppingCart(this)')
    button.innerText = 'X'

    div.appendChild(p)
    div.appendChild(button)

    li.appendChild(div)
    ul.appendChild(li)
  }
  shopping_mobile.appendChild(ul)
  const ul_clone = ul.cloneNode(true)
  shopping.appendChild(ul_clone)
}
generateShoppingCart()

function goToLarder() {
  try {
    document.getElementById('larder').classList.remove('d-none')
    document.getElementById('larder').classList.remove('d-sm-block')
    document.getElementById('recipes').classList.add('d-none')
    document.getElementById('recipes').classList.add('d-sm-block')
    document.getElementById('shopping-cart').classList.add('d-none')
    document.getElementById('shopping-cart').classList.add('d-sm-block')
    document.getElementById('icon-larder').classList.add('active-icon')
    document.getElementById('icon-recipes').classList.remove('active-icon')
    document.getElementById('icon-shopping-cart').classList.remove('active-icon')
  } catch (error) {
    console.error(error)
  }
}

function goToRecipes() {
  try {
    document.getElementById('recipes').classList.remove('d-none')
    document.getElementById('recipes').classList.remove('d-sm-block')
    document.getElementById('larder').classList.add('d-none')
    document.getElementById('larder').classList.add('d-sm-block')
    document.getElementById('shopping-cart').classList.add('d-none')
    document.getElementById('shopping-cart').classList.add('d-sm-block')
    document.getElementById('icon-larder').classList.remove('active-icon')
    document.getElementById('icon-recipes').classList.add('active-icon')
    document.getElementById('icon-shopping-cart').classList.remove('active-icon')
  } catch (error) {
    console.error(error)
  }
}

function goToShoppingList() {
  try {
    document.getElementById('shopping-cart').classList.remove('d-none')
    document.getElementById('shopping-cart').classList.remove('d-sm-block')
    document.getElementById('larder').classList.add('d-none')
    document.getElementById('larder').classList.add('d-sm-block')
    document.getElementById('recipes').classList.add('d-none')
    document.getElementById('recipes').classList.add('d-sm-block')
    document.getElementById('icon-larder').classList.remove('active-icon')
    document.getElementById('icon-recipes').classList.remove('active-icon')
    document.getElementById('icon-shopping-cart').classList.add('active-icon')
  } catch (error) {
    console.error(error)
  }
}

const queryString = window.location.search
if (queryString.split('?').length > 1) {
  const site = queryString.split('?')[1].split('=')[1]
  if (site === 'larder') goToLarder()
  else if (site === 'recipes') goToRecipes()
  else if (site === 'cart') goToShoppingList()
}
