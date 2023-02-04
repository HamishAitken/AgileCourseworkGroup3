// fetch all recipes
const token = JSON.parse(localStorage.getItem('token'))
if (!token) {
  window.location.href = '/login.html'
}
const searchbar = document.getElementById('search_bar')
searchbar.addEventListener('keyup', function (event) {
  if (event.key === 'Enter' && searchbar.value !== '') {
    const search_value = searchbar.value
    // TODO: what is this supposed to do?
    fetch('/api/recipes/search_by_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search_value }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
  }
})

fetch('/api/recipes/')
  .then((res) => res.json().then((response) => [res.status, response]))
  .then(([status_code, recipes]) => {
    if (status_code === 200) {
      const recipe_container = document.getElementById('recipe-container')
      let innerdata = ''

      recipes.forEach((recipe) => {
        // TODO: actual recipe list

        const recipe_name = recipe.name

        innerdata += `
<tr>
  <td>${recipe_name}</td>

  <td>
    <button id="edit" class="btn btn-primary" value="${recipe_name}">edit</button>
  </td>
  <td>
    <button id="delete"class="btn btn-danger">Delete</button>
  </td>
</tr>
`
      })

      recipe_container.innerHTML = innerdata
      const editButtons = document.querySelectorAll('#edit')

      for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', editRecipe)
      }
    } else {
      console.log('error')
    }
  })

// fetch specific recipe to edit
function editRecipe(event) {
  const search_value = event.target.value

  fetch('/api/recipes/search_by_name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      search_value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const recipe_name = data[0].name
      const recipe_image = data[0].image
      const recipe_ingredients = data[0].ingredients
      console.log(recipe_ingredients)
      const ingredient_name = displayingredients(recipe_ingredients)
      console.log(ingredient_name)
      const recipe_preparation_steps = data[0].preparation_steps

      const editor = document.createElement('editor')

      editor.innerHTML += `
<div class="modal" id="editor">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Recipe</h5>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" value="${recipe_name}">
          </div>
          <div class="form-group">
            <label for="image">Image</label>
            <input type="text" class="form-control" id="image" value="${recipe_image}">
          </div>
          <div class="form-group">
            <label for="ingredients">Ingredients</label>
            <textarea class="form-control" id="ingredients" rows="3">${ingredient_name}</textarea>
          </div>
          <div class="form-group">
            <label for="preparation_steps">Preparation Steps</label>
            <textarea class="form-control" id="preparation_steps" rows="3">${recipe_preparation_steps}</textarea>
          </div>
         
        </form>
      </div>
      <div class="modal-footer">
        <button id="save" type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
        <button type="button" id="close" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`

      document.body.appendChild(editor)
      const editorModal = document.getElementById('editor')
      editorModal.classList.add('show')
      editorModal.style.display = 'block'

      window.onclick = function (event) {
        if (event.target === editorModal) {
          editorModal.style.display = 'none'
        }
      }
      document.querySelector('close').addEventListener('click', function () {
        editorModal.style.display = 'none'
      })
      span.onclick = function () {
        editorModal.style.display = 'none'
      }

      const saveButton = document.querySelector('save')
      saveButton.addEventListener('click', function () {
        const name = document.getElementById('name').value
        const image = document.getElementById('image').value
        const ingredients = document.getElementById('ingredients').value
        const preparation_steps = document.getElementById('preparation_steps').value
        const recipeobj = {
          name,
          image,
          ingredients,
          preparation_steps,
        }

        fetch('/api/recipes/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipeobj),
        }).then((res) => res.json())
      })
    })
}

function displayingredients(ingredients) {
  let ingredients_name = ''
  ingredients.forEach((ingredient) => {
    ingredients_name += ingredient.ingredient + ', '
  })
  return ingredients_name
}
