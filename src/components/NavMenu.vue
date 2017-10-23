<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="../images/gtaonline-logo-mini.png" alt="" title="">
        </router-link>

        <div class="navbar-burger" data-target="mainMenu">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="navbar-menu" id="mainMenu">
        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">Admin</router-link>
          <router-link to="/login" class="navbar-item">Log in or sign up</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
  .navbar {
    margin-bottom: 20px;
    box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.1);
  }
</style>

