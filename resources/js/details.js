const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
console.log(id)
fetch('/api/recipes/')
  .then((res) => res.json())
  .then((data) => {
    const recipe_title = document.getElementById('recipe_title')
    const recipe_image = document.getElementById('recipe_image')
    const recipe_instructions = document.getElementById('recipe_instructions')
    const recipe_ingredients = document.getElementById('recipe_ingredients')

    for (const element of data) {
      if (element.id === id) {
        const title = element.name
        const image = element.image

        const instructions = element.preparation_steps.replace(/\n/g, '</br>')

        // parse ingredient and form an object
        const ingredients = element.ingredients
        for (const ingredient of ingredients) {
          recipe_ingredients.innerHTML += `
     <li>${ingredient.ingredient}</li>
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
