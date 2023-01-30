async function getRecipes(){
    
    
    let searchTerm = document.getElementById("ingInput").value;
    
    //read json file and parse
    fs.readFileSync();
    const response = await fetch('ingredients.json');
    const ingData = await response.json();
    ingData = JSON.parse(ingData);
    

    const searchResults = ingData.filter(data => {return data.ingredients.name.includes(searchTerm);});

    //testing if correct ingredient is found
    document.getElementById("output").innerHTML = searchResults.ingredients.id;
    
}

