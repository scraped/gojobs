<template>
  <nav class="navbar is-transparent is-dark">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item" exact-active-class="">
          <img
            src="@/images/gtaonline-logo-mini.png"
            alt="Go to the main page"
            title="Go to the main page"
          >
        </router-link>
        <span class="navbar-item is-size-3" style="font-family: 'SignPainter-HouseScript';">
          jobs
        </span>

        <router-link
          v-if="username"
          class="navbar-item is-hidden-desktop"
          :to="{ name: 'profile', params: { username } }">
            <img :src="avatars.small" style="border-radius: 50%;">
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
        </div>

        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Admin panel</span>
          </router-link>
          <router-link to="/crews" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <router-link
            v-if="username"
            class="navbar-item"
            :to="{ name: 'profile', params: { username } }">
            <img :src="avatars.small" style="border-radius: 50%;">
            <span>{{ username }}</span>
          </router-link>
          <router-link
            v-else
            class="navbar-item" :to="{ name: 'auth' }">
            <span>Sign Up or Log In</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import platforms from '../../config/static/platforms'
import {mapState} from 'vuex';
import {userAvatars} from '@/helpers';
// import {findIndex} from 'lodash';

export default {
  data() {
    return {
      menuOpened: false
    };
  },

  computed: {
    ...mapState('user', [
      'username'
    ]),

    avatars() {
      return userAvatars(this.username);
    }
  },

  methods: {
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/vars.scss";

.navbar {
  // background-color: transparent;
  // background-image: $main-gradient-light;
  // background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
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

