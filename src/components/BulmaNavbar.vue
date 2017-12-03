<template>
  <nav class="navbar is-transparent is-fixed-top" id="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="../images/gtaonline-logo-mini.png" alt="" title="">
        </router-link>

        <div class="navbar-burger" data-target="mainMenu">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="navbar-menu" id="mainMenu">
        <div class="navbar-start">
        </div>
        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <router-link to="/login" class="navbar-item">
            <span>Log In or Sign Up</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
window.addEventListener('DOMContentLoaded', event => {
  let navbar = document.getElementById('navbar');
  let navbarHeightExtended = navbar.offsetHeight * 3;
  let prevScrollPos = window.pageYOffset;

  window.addEventListener('scroll', e => {
    let currScrollPos = e.pageY;
    let hideNavbarPoint = Math.max(navbarHeightExtended, prevScrollPos);

    if (currScrollPos > hideNavbarPoint) {
      navbar.classList.add('navbar-hidden')
    } else {
      navbar.classList.remove('navbar-hidden')
    }

    if (currScrollPos > navbarHeightExtended) {
      navbar.classList.add('navbar-dark')
    } else {
      navbar.classList.remove('navbar-dark')
    }

    prevScrollPos = currScrollPos;
  });
});
</script>

<style lang="scss">
@import "../scss/bulma/utilities/_all";

$navbar-height: 4rem;
$navbar-item-color: $white;
$navbar-item-hover-color: $danger;
 $navbar-item-hover-background-color: transparent;

 $navbar-tab-hover-background-color: pink;
  $navbar-tab-hover-border-bottom-color: pink;

@import "../scss/bulma/components/navbar";

.navbar {
  background-color: transparent;
  background-image: linear-gradient(to bottom, rgba($black, 0.2), transparent);
  transition-duration: $speed * 2;
}

.navbar-hidden {
  transform: translateY(-100px);
}

.navbar-dark {
  background: $dark;
}
</style>

