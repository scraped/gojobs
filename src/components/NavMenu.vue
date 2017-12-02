<template>
  <nav class="navbar is-transparent is-fixed-top">
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
</script>

<style lang="scss">
@import '../scss/bulma/utilities/initial-variables';
// @import '../scss/bulma/utilities/derived-variables';

// .navbar-item {
//   transition: $speed;
//   &:hover span {
//     border-bottom: 3px solid $danger;
//     margin-bottom: -3px;
//   }
// }

.navbar {
  background-color: transparent;
  background-image: linear-gradient(to bottom, rgba($black, 0.2), transparent);
}
</style>

