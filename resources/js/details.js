const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
console.log(id)
fetch('/api/admin/get_recipes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((res) => res.json())
  .then((data) => {
    const recipe_title = document.getElementById('recipe_title')
    const recipe_image = document.getElementById('recipe_image')
    const recipe_instructions = document.getElementById('recipe_instructions')
    const recipe_ingredients = document.getElementById('recipe_ingredients')

    for (element of data) {
      // FIXME: element will never have "$loki" in it
      if (element.$loki == id) {
        const title = element.recipe
        const image = element.image
        const instructions = element.instructions.replace(/\n/g, '</br>')

        //parse ingredient and form an object
        const ingredients = element.ingredients
        const ingredientsObj = {}
        ingredients.split('\n').forEach((ingredient) => {
          const ingredientArr = ingredient.split(' ')
          const name = ingredientArr.slice(1).join(' ')
          const quantity = ingredientArr[0]
          ingredientsObj[name] = quantity
        })

        //display lsit of ingredients
        for (const [key, value] of Object.entries(ingredientsObj)) {
          recipe_ingredients.innerHTML += `
               <li>${key}-${value}</li>
                `
        }

        recipe_title.innerHTML += `
         <h4 class="text-center">${title}</h4>
         `

        recipe_image.innerHTML = `
<img src="${image}" class="img-fluid" alt="...">
`

        recipe_instructions.innerHTML = `
<p id="markdown">${instructions}</p>


`
      }
    }
  })
