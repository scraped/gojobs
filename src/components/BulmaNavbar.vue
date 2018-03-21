<template>
  <nav class="navbar is-dark is-fixed-top">
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
           <!-- <div class="navbar-item has-dropdown">
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
            </div> -->
          </div>
        </div>

        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Admin panel</span>
          </router-link>
          <router-link to="/crews" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <router-link v-if="username" to="/profile" class="navbar-item">
            <figure class="image is-32x32">
              <img :src="`https://a.rsg.sc/n/${username}/s`" style="border-radius: 50%;">
            </figure>
            <span>{{ username }}</span>
          </router-link>
          <router-link v-else to="/login" class="navbar-item">
            <span>Sign Up</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', [
      'username'
    ])
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

