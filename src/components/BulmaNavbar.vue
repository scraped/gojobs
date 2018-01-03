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
            <a class="navbar-link is-unselectable">
              <span class="is-hidden-desktop">Current platform:</span>
              {{ currPlatform.name }}
            </a>

            <div class="navbar-dropdown">
              <a
                class="navbar-item"
                v-for="platform in platforms"
                :key="platform.id"
                v-if="platform.id !== currPlatform.id">
                {{ platform.name }}
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
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('common', [
      'currPlatform'
    ]),
    ...mapState('common', [
      'platforms'
    ])
  }
};

// document.addEventListener('DOMContentLoaded', () => {
//   const navbarBurger = document.querySelector('.navbar-burger');

//   navbarBurger.addEventListener('click', () => {
//     const navbarMenuId = navbarBurger.dataset.target;
//     const navbarMenu = document.getElementById(navbarMenuId);

//     navbarBurger.classList.toggle('is-active');
//     navbarMenu.classList.toggle('is-active');
//   });

//   //

//   const navbarDropdownLink = document.querySelector('.navbar-link');
//   const navbarDropdown = navbarDropdownLink.parentElement;

//   document.addEventListener('click', e => {
//     const target = e.target;

//     if (target === navbarDropdownLink) {
//       navbarDropdown.classList.toggle('is-active');
//     }

//     if (!navbarDropdown.contains(target)) {
//       navbarDropdown.classList.remove('is-active');
//     }
//   });

// });
</script>


<style lang="scss">
@import "../scss/utilities/_all";
@import "../scss/vars";

.navbar {
  background-color: transparent;
  background-image: $main-gradient;
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

