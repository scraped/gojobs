<template>
  <b-navbar>
    <b-container>
      <b-navbar-brand>
        <router-link to="/" class="navbar-item">
          <img src="../images/gtaonline-logo-mini.png" alt="" title="">
        </router-link>

        <b-navbar-burger data-target="mainMenu">
          <span></span><span></span><span></span>
        </b-navbar-burger>
      </b-navbar-brand>

      <b-navbar-menu id="mainMenu">
        <b-navbar-end>
          <router-link to="/admin" class="navbar-item">Admin</router-link>
          <router-link to="/login" class="navbar-item">Log in or sign up</router-link>
        </b-navbar-end>
      </b-navbar-menu>
    </b-container>
  </b-navbar>
</template>

<script>
import { bulmaComponentGenerator } from 'vue-bulma-components';

export default {
  name: 'nav-menu',

  components: {
    'b-navbar-menu': bulmaComponentGenerator('navbar-menu'),
    'b-navbar-end': bulmaComponentGenerator('navbar-end'),
  }
};
</script>

<style scoped>
  .navbar {
    margin-bottom: 20px;
    box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.1);
  }
</style>

