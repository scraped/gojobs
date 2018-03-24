<template>
  <nav class="navbar is-dark is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img :src="logo" alt="" title="">
        </router-link>
        <span class="navbar-item is-size-3" style="font-family: 'SignPainter-HouseScript';">
          jobs
        </span>

        <router-link to="/signup" class="navbar-item">
          <span>Sign Up</span>
        </router-link>

        <div
          class="navbar-burger"
          @click="toggleMenu"
          :class="{ 'is-active': menuOpened }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuOpened }">
        <div class="navbar-start">
           <div class="navbar-item has-dropdown">
            <a class="navbar-link is-unselectable">
              <span class="is-hidden-desktop">Current platform:</span>
              PC
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">PC</a>
              <a class="navbar-item">PS4</a>
              <a class="navbar-item">XboxOne</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Admin panel</span>
          </router-link>
          <router-link to="/crews" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <template v-if="username">
            <router-link
              :to="{ path: 'profile', params: { username } }"
              class="navbar-item">
              <figure class="image is-32x32">
                <img :src="`https://a.rsg.sc/n/${username}/s`" style="border-radius: 50%;">
              </figure>
              <span>{{ username }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/signup" class="navbar-item">
              <span>Sign Up</span>
            </router-link>
            <router-link to="/login" class="navbar-item">
              <span>Log In</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {mapState} from 'vuex';
import logo from 'src/images/logo2.png';

export default {
  data() {
    return {
      logo,
      menuOpened: false
    };
  },

  computed: {
    ...mapState('user', [
      'username'
    ])
  },

  methods: {
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    }
  }
};
</script>

<style lang="scss">
@import "src/scss/vars";

.navbar {
  background-color: transparent;
  // background-image: $main-gradient;
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

