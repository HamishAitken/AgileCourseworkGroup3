function addToShoppingCart(element){
    //Get the Text of the <p> Element of the List where the button was clicked.
    let text = element.previousElementSibling.innerText;
    console.log(text);
    var cart = JSON.parse(localStorage.getItem("cart"));
    if(cart == null) cart = [];
    cart.push(text);
    localStorage.setItem("cart", JSON.stringify(cart));
}