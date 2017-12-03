<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <bulma-navbar></bulma-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import BulmaNavbar from './components/BulmaNavbar.vue';

export default {
  components: {
    BulmaNavbar
  }
};
</script>
