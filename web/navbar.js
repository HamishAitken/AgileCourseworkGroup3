const navigationbar=()=>{
  const navbar = document.createElement('nav')
  let innerHTML='';
    innerHTML = `<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom border-dark ">
    <div class="container-fluid ">
        <a class="navbar-brand" href="/admin">
            <img src="https://cdn.shopify.com/s/files/1/0397/3749/1613/files/littleGreenLogo_360x.jpg?v=1613552940" alt="littleGreenLogo_360x" width="80px" height="50px" class="rounded">
          </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/admin">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/create_recipe">create recipe</a>
          </li>
        
          
        </ul>
      </div>
    </div>
  </nav>`;
  navbar.innerHTML = innerHTML;
    return navbar;

}