<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <bulma-navbar></bulma-navbar>
    <router-view></router-view>
    <bulma-footer></bulma-footer>
  </div>
</template>

<script>
import BulmaNavbar from '@/layout/LayoutNavbar.vue';
import BulmaFooter from '@/layout/LayoutFooter.vue';

export default {
  components: {
    BulmaNavbar,
    BulmaFooter
  }
};
</script>
