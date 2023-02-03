const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

fetch('/api/recipes/')
  .then((res) => res.json())
  .then((data) => {
    const recipe_title = document.getElementById('recipe_title')
    const recipe_image = document.getElementById('recipe_image')
    const recipe_instructions = document.getElementById('recipe_instructions')
    const recipe_ingredients = document.getElementById('recipe_ingredients')

    for (let i=0;i<data.length;i++) {
      
      if ( data[i].id==id) {
        console.log(data[i].id)

        const instructions = data[i].preparation_steps.replace(/\n/g, '</br>');

        // parse ingredient and form an object
        const ingredients = data[i].ingredients;
        for (let j=0;j<ingredients.length;j++) {
          recipe_ingredients.innerHTML += `
     <li>${ingredients[j].ingredient}---${ingredients[j].id}</li>
     `
        }

        recipe_title.innerHTML += `
         <h4 class="text-center">${data[i].name}</h4>
         `

        recipe_image.innerHTML = `
      <img src="${data[i].image}" class="img-fluid" alt="...">
      `

        recipe_instructions.innerHTML = `
      <p id="markdown">${instructions}</p>
      `
      }
    }
  })
