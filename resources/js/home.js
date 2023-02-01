var selectedItems = [];

function selectIngredient(clicked_id){
    console.log(clicked_id);
    el = document.getElementById(clicked_id);
    console.log(el.style.color);
    if(el.style.color == "rgb(255, 255, 255)"){
        el.style.color = "#655F58";
        el.style.backgroundColor = "#B6AEAE";

        let index = selectedItems.indexOf(clicked_id);
        if (index > -1) {
           selectedItems.splice(index, 1); 
        }
        console.log(selectedItems)
    }else{
        el.style.color = "#FFFFFF";
        el.style.backgroundColor = "#329E62";
        selectedItems.push(clicked_id);
        console.log(selectedItems);
    }

}

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
            console.log(ingredient);
        }
    }  
}

generateIngredients();