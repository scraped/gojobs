<template>
  <div id="app">
    <nav-menu></nav-menu>
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue';

export default {
  name: 'app',

  components: {
    'nav-menu': NavMenu
  },

  data () {
    return {
      message: 'Welcome to Your Vue.js App'
    };
  },

  methods: {
    start () {
      this.$Progress.start();
    },
    set (num) {
      this.$Progress.set(num);
    },
    increase (num) {
      this.$Progress.increase(num);
    },
    decrease (num) {
      this.$Progress.decrease(num);
    },
    finish () {
      this.$Progress.finish();
    },
    fail () {
      this.$Progress.fail();
    }
  },

  mounted () {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish();
  },

  created () {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start();
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish();
    })
  }
}
</script>
