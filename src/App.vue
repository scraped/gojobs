<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <ui-navbar></ui-navbar>
    <router-view></router-view>
    <ui-footer></ui-footer>
  </div>
</template>

<script>
import UiNavbar from '@/layout/UiNavbar.vue';
import UiFooter from '@/layout/UiFooter.vue';

export default {
  components: {
    UiNavbar,
    UiFooter
  }
};
</script>
