<template>
<div>
  <section class="hero is-dark">
    <div class="hero-head">
      <nav class="navbar is-transparent headroom">
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
            <div class="navbar-start">
              <!-- <div class="tags">
                <div class="tag is-black has-text-grey">PC Jobs</div>
                <div class="tag is-black has-text-grey">
                  <icon-gta :icon="'f168'"></icon-gta> Rally
                </div>
              </div> -->
            </div>
            <div class="navbar-end">
              <router-link to="/admin" class="navbar-item"><span>Admin</span></router-link>
              <router-link to="/login" class="navbar-item">Log in or sign up</router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <div class="hero-body">
      <div class="container">
        <slot></slot>
      </div>
    </div>
  </section>
  <br>
</div>
</template>

<script>
</script>

<style lang="scss">
@import '../scss/bulma/utilities/initial-variables';
@import '../scss/bulma/utilities/derived-variables';

.navbar-item {
  transition: $speed;
  &:hover span {
    border-bottom: 4px solid $danger;
    margin-bottom: -4px;
  }
}
</style>

