let navbarBurger = document.querySelector(".navbar-burger");
let target = document.getElementById(navbarBurger.dataset.target);

navbarBurger.onclick = () => {
  navbarBurger.classList.toggle("is-active");
  target.classList.toggle("is-active");
};