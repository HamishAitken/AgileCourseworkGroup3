function clickedIcon() {
  const iconShopping = document.getElementById('shopping-icon')
  const iconClose = document.getElementById('close-icon')
  const sidebar = document.getElementById('sidebar')
  if (iconShopping.classList.contains('d-none')) {
    iconShopping.classList.remove('d-none')
    iconClose.classList.add('d-none')
    sidebar.style.right = '20px'
  } else {
    iconShopping.classList.add('d-none')
    iconClose.classList.remove('d-none')
    sidebar.style.right = '220px'
  }
}

document.getElementById('sidebar').addEventListener('click', clickedIcon)
