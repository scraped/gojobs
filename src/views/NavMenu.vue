<template>
  <navbar>
    <container>
      <navbar-brand>
        <router-link to="/" class="navbar-item">
          <img src="../images/gtaonline-logo-mini.png" alt="" title="">
        </router-link>

        <navbar navbar-burger data-target="mainMenu">
          <span></span><span></span><span></span>
        </navbar>
      </navbar-brand>

      <navbar-menu id="mainMenu">
        <navbar-end>
          <router-link to="/admin" class="navbar-item">Admin</router-link>
          <router-link to="/login" class="navbar-item">Log in or sign up</router-link>
        </navbar-end>
      </navbar-menu>
    </container>
  </navbar>
</template>

<script>
import { bulmaComponentGenerator } from 'vue-bulma-components';

export default {
  name: 'NavMenu',
  // missing component
  components: {
    'navbar-menu': bulmaComponentGenerator('navbar-menu'),
    'navbar-end': bulmaComponentGenerator('navbar-end'),
  }
};
</script>

<style scoped>
  .navbar {
    box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.1);
  }
</style>

