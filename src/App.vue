<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <nav-menu></nav-menu>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue';

export default {
  name: 'app',

  components: {
    NavMenu
  },

  data () {
    return {};
  },

  created () {
    this.$Progress.start();

    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      next();
    });

    this.$router.afterEach((to, from, next) => {
      this.$Progress.finish();
      next();
    });
  }
}
</script>
