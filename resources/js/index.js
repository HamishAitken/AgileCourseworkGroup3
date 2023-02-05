const { createApp } = Vue
window.onload = function () {
  createApp({
    data() {
      return {
        recipes: [],
        ingredients: [],
      }
    },
    methods: {
      //fetch all recipes and display them
      fetch_recipes() {
        fetch('/api/recipes/')
          .then((res) => res.json())
          .then((data) => {
            this.recipes = data
          })
      },
      //search for recipes using the title of the recipe
      search_recipes() {
        const search_value = document.getElementById('search_recipes').value

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
            if (status_code === 200) {
              this.recipes = data
            }
          })
      },
      // fetch all ingredients and display them
      fetch_ingredients() {
        fetch('/api/ingredients/')
          .then((res) => res.json().then((response) => [res.status, response]))
          .then(([status_code, data]) => {
            if (status_code === 200) {
              this.ingredients = data
            }
          })
      },
      //search for ingredients
      search_ingredients() {
        const search_value = document.getElementById('search_ingredients').value

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
          .then(([status_code, data]) => {
            if (status_code === 200) {
              this.ingredients = data
            }
          })
      },
    },
    created() {
      this.fetch_recipes()
      this.fetch_ingredients()
    },
  }).mount('#recipes_app')
}

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
