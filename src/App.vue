<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <navbar></navbar>
    <router-view></router-view>
    <footer></footer>
  </div>
</template>

<script>
import Navbar from '@components/Navbar.vue';
import Footer from '@components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer
  }
};
</script>
