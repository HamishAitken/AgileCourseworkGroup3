function addToShoppingCart(element){
    //Get the Text of the <p> Element of the List where the button was clicked.
    // TODO: save ingredient IDs instead of ingredient names. Use the IDs in the cart to group and add links to similar ingredients.
    let text = element.previousElementSibling.innerText;
    console.log(text);
    var cart = JSON.parse(localStorage.getItem("cart"));
    if(cart == null) cart = [];
    cart.push(text);
    localStorage.setItem("cart", JSON.stringify(cart));
}