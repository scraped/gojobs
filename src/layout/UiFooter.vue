<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <div class="columns">
          <div class="column">
            <div class="content">
              <div class="subtitle subtitle__special">GTA Online Jobs</div>
              <router-link :to="{ path: '/' }">Go to the main page</router-link>
            </div>
          </div>
          <div class="column">
            <div class="subtitle">Cookies</div>
            <div class="content">
              Bla bla bla :P
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/scss/vars.scss";

.subtitle {
  font-family: 'Oswald';
  color: $grey;
}

.subtitle__special {
  // color: $gtaonline;
}

.footer {
  margin-top: $size-normal;
  color: $grey-lighter;
}

a {
  color: $grey-light;
  &:hover {
    color: $grey-lighter;
  }
}
</style>
