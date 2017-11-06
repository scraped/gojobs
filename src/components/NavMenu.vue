<template>
  <nav class="navbar is-fixed-top is-dark headroom">
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
        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">Admin</router-link>
          <router-link to="/login" class="navbar-item">Log in or sign up</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Headroom from 'headroom.js';

document.addEventListener("DOMContentLoaded", () => {
let navbar = document.querySelector(".navbar");
console.log(navbar);
new Headroom(navbar).init();
});

export default {};
</script>

<style lang="scss">
@import '../scss/bulma/utilities/initial-variables';

.headroom {
    will-change: transform;
    transition: transform $speed linear;
}
.headroom--pinned {
    transform: translateY(0%);
}
.headroom--unpinned {
    transform: translateY(-100%);
}
</style>

