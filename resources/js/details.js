const { createApp } = Vue
createApp({
  data() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    return {
      recipe: {},
      fetchData() {
        fetch(`/api/recipes/${id}`)
          .then((res) => res.json())
          .then((data) => {
           
            this.recipe = {

              name: data.name,
              image: data.image,
              ingredients: data.ingredients,
              preparation_steps:  data.preparation_steps
            }
            console.log(this.recipe);
          })
      }
    }
  },
  created() {
    this.fetchData();
  }
}).mount('#app')



  











 
    /*
     fetch(`/api/recipes/${id}`)
    .then((res) => res.json())
    .then((data) => {
    // TODO: check whether a recipe was returned, instead of an error
    // TODO: #11 add a share recipe link which would allow user to share the page
    const recipe_title = document.getElementById('recipe_title')
    const recipe_image = document.getElementById('recipe_image')
    const recipe_instructions = document.getElementById('recipe_instructions')
    const recipe_ingredients = document.getElementById('recipe_ingredients')

    recipe_title.innerHTML = data.name

   


    // TODO: add cooking time

    // TODO: add serves x people

    // TODO: add description

    // parse ingredient and form an object
    const ingredients = data.ingredients
    recipe_ingredients.innerHTML = ''
    for (let j = 0; j < ingredients.length; j++) {
      recipe_ingredients.innerHTML += `
      <li class="mb-2">
        <div class="d-flex flex-row flex-row-table align-content-start">
          <p class="mb-1 align-self-center">${ingredients[j].ingredient}</p>
          <button
            type="button"
            onclick="addToShoppingCart(this)"
            class="btn btn-outline-success ms-auto p-2"
            data-toggle="tooltip"
            data-placement="top"
            title="Add to Shopping List"
            id="${ingredients[j].id}"
          ></button>
        </div>
      </li>
      `
    }

    recipe_image.innerHTML = `
    <img src="${data.image}" class="img-fluid" alt="Recipe">
    `

    // TODO: render markdown? At least make the list "fancy", that is use list elements from details_page.html
    const instructions = data.preparation_steps.replace(/\n/g, '</br>')
    recipe_instructions.innerHTML = `
      <p id="markdown">${instructions}</p>
      `
  })
*/
function addToShoppingCart(element) {
  // Get the Text of the <p> Element of the List where the button was clicked.
  // TODO: save ingredient IDs instead of ingredient names. Use the IDs in the cart to group and add links to similar ingredients.
  const text = element.previousElementSibling.innerText
  console.log(text)
  let cart = JSON.parse(localStorage.getItem('cart'))
  if (cart === null) cart = []
  cart.push(text)
  localStorage.setItem('cart', JSON.stringify(cart))
}
