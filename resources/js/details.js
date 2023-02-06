const { createApp } = Vue
createApp({
  data() {
    return {
      recipe: {},
    }
  },
  methods: {
    fetchData() {
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id')
      fetch(`/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          this.recipe = {
            name: data.name,
            image: data.image,
            ingredients: data.ingredients,
            preparation_steps: data.preparation_steps,
          }
        })
    },
    addToShoppingCart(e) {
      // Get the Text of the <p> Element of the List where the button was clicked.
      // TODO: save ingredient IDs instead of ingredient names. Use the IDs in the cart to group and add links to similar ingredients.
      const text = e.target.value
      let cart = JSON.parse(localStorage.getItem('cart'))
      if (cart === null) cart = []
      cart.push(text)
      localStorage.setItem('cart', JSON.stringify(cart))
    },
  },
  created() {
    this.fetchData()
  },
}).mount('#app')
