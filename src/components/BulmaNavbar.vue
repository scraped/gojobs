<template>
  <nav class="navbar is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="../images/logo2.png" alt="" title="">
        </router-link>
        <span class="navbar-item is-size-3" style="font-family: 'SignPainter-HouseScript';">jobs</span>

        <div class="navbar-burger" data-target="navbar-menu">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="navbar-menu" id="navbar-menu">
        <div class="navbar-start">
           <div class="navbar-item has-dropdown">
            <a class="navbar-link">
              PC
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                PS4
              </a>
              <a class="navbar-item">
                Xbox One
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <router-link to="/login" class="navbar-item">
            <span>Sign Up</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const navbarBurger = document.querySelector('.navbar-burger');

  navbarBurger.addEventListener('click', () => {
    const navbarMenuId = navbarBurger.dataset.target;
    const navbarMenu = document.getElementById(navbarMenuId);

    navbarBurger.classList.toggle('is-active');
    navbarMenu.classList.toggle('is-active');

  });

  //

  const navbarDropdown = document.querySelector('.navbar-link');

  document.addEventListener('click', e => {
    const target = e.target;

    if (target === navbarDropdown) {
      navbarDropdown.parentElement.classList.toggle('is-active');
    }

    // if (target.contains(navbarDropdown))
  });

});
</script>


<style lang="scss">
@import "../scss/bulma/utilities/_all";

$navbar-height: 4rem;
$navbar-item-color: $white;
$navbar-item-hover-color: $white;
$navbar-item-hover-background-color: rgba($black, 0.15);

$navbar-dropdown-arrow: $white;
$navbar-dropdown-border-top: none;
$navbar-dropdown-background-color: $dark;

 $navbar-tab-hover-background-color: $dark;

@import "../scss/bulma/components/navbar";
@import "../scss/vars";

.navbar {
  background-color: transparent;
  background-image: linear-gradient(to right, $rockstar, $gtaonline-dark);
}

.navbar-item {
  transition-duration: $speed;
}

.navbar-menu.is-active {
  background: $dark;
}

.navbar-burger {
  color: $white;
}
</style>

