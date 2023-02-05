const { createApp } = Vue

createApp({
  data() {
    return {
      recipes: {
        data: [],
      },
    }
  },
  methods: {
    //get recipies
    getRecipes() {
      fetch("/api/recipes/")
        .then((res) => res.json())
        .then((data) => {
          this.recipes = {
            data: data,
          }

          console.log(this.recipes.data)
        })
    },
    //delete recipe
    deleteRecipe(e) {
      const token = JSON.parse(localStorage.getItem("token"))
      if (!token) {
        window.location.href = "/login.html"
      }

      const id = e.target.value
      console.log(id)
      fetch(`/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          location.reload()
          alert("deleted")
        })
    },

    //edit recipe
    editRecipe(e) {
      const token = JSON.parse(localStorage.getItem("token"))
      if (!token) {
        window.location.href = "/login.html"
      }
      const id = e.target.value
      console.log(id)
      fetch(`/api/recipes/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
         
          window.location.href = `/edit.html?id=${id}`
        })
    },
    search_recipes(){
      const token = JSON.parse(localStorage.getItem("token"))
      if (!token) {
        window.location.href = "/login.html"
      }
      const search_value = document.getElementById("search_recipes").value
      console.log(search_value);
      fetch(`/api/recipes/search_by_name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          search_value,
        }),

      })
       .then((res) => res.json().then((response) => [res.status, response]))
      .then(([status_code, data]) => {
        if (status_code === 200) {
          this.recipes={
            data: data
          }
        }
      })
    }
  },
  created() {
    this.getRecipes()
  },
}).mount("#app")

