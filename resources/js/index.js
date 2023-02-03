var selectedItems = [];

function generateIngredients(){
    let groups = ["bakingGoods", "nuts"];
    for (let i = 0; i < groups.length; i++) {
        //API CALL GET INGREDIENTS
        let ingredients = ["Flour", "Baking Soda", "Whole Wheat Flour", "Granulated Sugar", "Brown Sugar", "Cocoapowder", "Wheat Flour"];
        ingredients.push("more....");
        let elGroup = document.getElementById(groups[i]);
        for(let j = 0; j<ingredients.length; j++){
            ingredient = document.createElement("p");
            ingredient.classList.add("element-flex");
            ingredient.setAttribute("id", ingredients[j]);
            ingredient.innerText = ingredients[j];
            ingredient.setAttribute("onclick", "selectIngredient(this.id)");
            elGroup.appendChild(ingredient);   
        }
    }  
}

function generateRecipes(recipesInput){
    //API Call to retrieve those here
    let recipes = recipesInput;
    var row;
    for(let i = 0;i<recipes.length;i++){
        if(i%2 == 0){
            if(i!=0)document.getElementById("recipesCard").appendChild(row);
            row = document.createElement("div");
            row.classList.add("row", "row-cols-1", "row-cols-md-2", "g-5", "mx-sm-4", "mx-2");
            //The first row has more margin at the top, then the rest
            if(i==0){
                row.classList.add("mt-5");
                row.classList.add("mt-sm-0");
            }
            else row.classList.add("mt-2");
            //The last row gets added an aditional Class, that adds a margin to the Last Card, so it does not overlap in the mobile version with the navbar
            if(i+2>=recipes.length){
                row.classList.add("rows");
            }   
        }
        let col = document.createElement("div");
        col.classList.add("col", "mt-4");
        
        let card = document.createElement("div");
        card.classList.add("card");
        card.style.borderRadius = "7px"; 
    
        let card_Body = document.createElement("div");
        card_Body.classList.add("card-body", "shadow");
    
        let title = document.createElement("h5");
        title.classList.add("card-title", "text-center", "color-text-brownish");
        title.innerHTML = "<b>"+recipes[i]+"</b>";
        card_Body.appendChild(title);

        let img = document.createElement("img");
        img.classList.add("card-img-top");
        img.style.borderRadius = "10px";
        img.setAttribute("alt", recipes[i]);
        img.setAttribute("src", "https://picsum.photos/300/200");
        img.setAttribute("height", "200px");

        card.appendChild(card_Body);
        card.appendChild(img);
        col.appendChild(card);
        row.appendChild(col);
    }
    document.getElementById("recipesCard").appendChild(row);
}

getInitialRecipes().then(initialRecipes => {
    generateRecipes(initialRecipes)
  })
generateIngredients();

function removeFromShoppingCart(element){
    //Get the Text of the <p> Element of the List where the button was clicked.
    let text = element.previousElementSibling.innerText;
    var cart = JSON.parse(localStorage.getItem("cart"));
    let index = cart.indexOf(text);
    if (index > -1) cart.splice(index, 1); 
    
    element.parentElement.parentElement.remove();
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length == 0) localStorage.removeItem("cart");
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
function generateShoppingCart(){
    var shopping = document.getElementById("shopping-list");
    var shopping_mobile = document.getElementById("shopping-list-mobile");
    var ul = document.createElement("ul");
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (cart === null || cart.legnth === 0) {
        let par = document.createElement("p");
        par.innerText = "The Shopping-list appears to be empty";
        par.classList.add("ms-4");
        shopping.appendChild(par);
        shopping_mobile.appendChild(par);
        return;
    }
    for(let i = 0;i<cart.length;i++){
        let li = document.createElement("li");
        li.classList.add("mb-2");
        
        let div = document.createElement("div");
        div.classList.add("d-flex","flex-row", "flex-row-table",  "align-content-start");
        
        let p = document.createElement("p");
        p.classList.add("mb-1", "align-self-center");
        p.innerText = cart[i];

        let button = document.createElement("button");
        button.classList.add("btn", "btn-outline-danger", "ms-auto", "p-2");
        button.setAttribute("type", "button");
        button.setAttribute("data-toggle", "tooltip");
        button.setAttribute("data-placemen", "top");
        button.setAttribute("title", "Remove from shoppping-list");
        button.setAttribute("onclick", "removeFromShoppingCart(this)");
        button.innerText = "X";

        div.appendChild(p);
        div.appendChild(button);

        li.appendChild(div);
        ul.appendChild(li);

    }
    shopping_mobile.appendChild(ul);
    let ul_clone = ul.cloneNode(true);
    shopping.appendChild(ul_clone);
}


generateShoppingCart();
function goToLarder(){
    try{
        document.getElementById("larder").classList.remove("d-none");
        document.getElementById("larder").classList.remove("d-sm-block");
        document.getElementById("recipes").classList.add("d-none");
        document.getElementById("recipes").classList.add("d-sm-block");
        document.getElementById("shopping-cart").classList.add("d-none");
        document.getElementById("shopping-cart").classList.add("d-sm-block");
        document.getElementById("icon-larder").classList.add("active-icon");
        document.getElementById("icon-recipes").classList.remove("active-icon");
        document.getElementById("icon-shopping-cart").classList.remove("active-icon");
    }catch(error){
        console.log(error);
    }
}

function goToRecipes(){
    try{
        document.getElementById("recipes").classList.remove("d-none");
        document.getElementById("recipes").classList.remove("d-sm-block");
        document.getElementById("larder").classList.add("d-none");
        document.getElementById("larder").classList.add("d-sm-block");
        document.getElementById("shopping-cart").classList.add("d-none");
        document.getElementById("shopping-cart").classList.add("d-sm-block");
        document.getElementById("icon-larder").classList.remove("active-icon");
        document.getElementById("icon-recipes").classList.add("active-icon");
        document.getElementById("icon-shopping-cart").classList.remove("active-icon");
    }catch(error){
        console.log(error);
    }
    
}

function goToShoppingList(){
    try{
        document.getElementById("shopping-cart").classList.remove("d-none");
        document.getElementById("shopping-cart").classList.remove("d-sm-block");
        document.getElementById("larder").classList.add("d-none");
        document.getElementById("larder").classList.add("d-sm-block");
        document.getElementById("recipes").classList.add("d-none");
        document.getElementById("recipes").classList.add("d-sm-block");
        document.getElementById("icon-larder").classList.remove("active-icon");
        document.getElementById("icon-recipes").classList.remove("active-icon");
        document.getElementById("icon-shopping-cart").classList.add("active-icon");
    }catch(error){
        console.log(error);
    }
    
}

const queryString = window.location.search;
if(queryString.split("?").length>1){
    site = queryString.split("?")[1].split("=")[1];
    if(site == "larder") goToLarder();
    else if(site == "recipes") goToRecipes();
    else if(site == "cart") goToShoppingList();
}

async function getInitialRecipes() {
    const recData = await fetch('recipes.json').then((res) => res.json())
    const collectedRecipes = recData.data.recipes.slice()
    const recipeNames = collectedRecipes.map(recipe => recipe.name)
    return recipeNames
}


async function getRecipes() {
    // const recipeContainer = document.getElementById('recipesCard')
    // recipeContainer.innerHTML = " "

    // let searchTerm = document.getElementById('formIngredients').value
    
  
    
  
    // //read json file and parse
    // // TODO: handle missing file
    // const ingData = await fetch('ingredients.json').then((res) => res.json())
  
    // const searchResults = ingData.data.ingredients.filter((ingredient) => ingredient.name === searchTerm)
  
    // // TODO: handle missing file
    // const recData = await fetch('recipes.json').then((res) => res.json())
  
    // // TODO: dropdown to allow user to select the ingredient (instead of using the first one)
    // // TODO: handle not finding any ingredients
    // const ingID = searchResults[0].id
  
    // // TODO: handle not finding any recipes (show a message?)
    // const collectedRecipes = recData.data.recipes.filter((recipe) => recipe.ingredients.find((ing) => ing.id === ingID))
  
    
  
    // const recipeNames = collectedRecipes.map(recipe => recipe.name)
    // generateRecipes(recipeNames)
  
    
    const recipeContainer = document.getElementById('recipesCard')
  recipeContainer.innerHTML = " "

  let searchTerms = document.getElementById('formIngredients').value.split(',')

  //read json file and parse
  const ingData = await fetch('ingredients.json').then((res) => res.json())

  // Filter the ingredients data to only contain the ones that match the search terms
  let allSearchResults = []
  for (let term of searchTerms) {
    let searchResults = ingData.data.ingredients.filter((ingredient) => ingredient.name === term.trim())
    allSearchResults.push(searchResults)
  }

  // TODO: handle missing file
  const recData = await fetch('recipes.json').then((res) => res.json())

  let collectedRecipes = recData.data.recipes
  for (let resultArray of allSearchResults) {
    for (let result of resultArray) {
      collectedRecipes = collectedRecipes.filter((recipe) => recipe.ingredients.find((ing) => ing.id === result.id))
    }
  }

  if (!allSearchResults.flat().length) {
    recipeContainer.innerHTML = "No ingredients found matching the search terms."
  } else if (!collectedRecipes.length) {
    recipeContainer.innerHTML = "No recipes found using the ingredients."
  } else {
    const recipeNames = collectedRecipes.map(recipe => recipe.name)
    generateRecipes(recipeNames)
  }
    
    
  }
