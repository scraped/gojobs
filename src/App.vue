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
import bus from './bus';
import NavMenu from './components/NavMenu.vue';

export default {
  name: 'app',

  components: {
    NavMenu
  },

  data () {
    return {};
  },

  mounted () {
    if (!bus.loading) bus.$emit('finish-loading');
  },

  created () {
    bus.$on('start-loading', function() {
      console.log('чекаем старт');
      this.$Progress.start();
      bus.loading = true;
    });

    bus.$on('finish-loading', function() {
      console.log('чекаем конец');
      this.$Progress.finish();
      bus.loading = false;
    });

    bus.$emit('start-loading');

    this.$router.beforeEach((to, from, next) => {
      console.log('beforeEach: ' + bus.loading);
      if (!bus.loading) bus.$emit('start-loading');
      next();
    });

    this.$router.afterEach((to, from) => {
      if (!bus.loading) bus.$emit('finish-loading');
    });
  }
}
</script>
