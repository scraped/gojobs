<template>
  <div id="app">
    <!-- <vue-progress-bar></vue-progress-bar> -->
    <nprogress-container></nprogress-container>
    <nav-menu></nav-menu>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue';
import NprogressContainer from 'vue-nprogress/src/NprogressContainer.vue'

export default {
  name: 'app',

  components: {
    NavMenu,
    NprogressContainer
  },

  data () {
    return {};
  },

  // created () {
  //   this.$Progress.start();

  //   this.$router.beforeEach((to, from, next) => {
  //     this.$Progress.start();
  //     next();
  //   });

  //   this.$router.afterEach((to, from, next) => {
  //     this.$Progress.start();
  //     next();
  //   });
  // }
}
</script>
