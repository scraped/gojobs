<template>
  <footer class="footer">
    <div class="container">
      <div class="content">
        <div class="subtitle has-text-grey">GTA Online Jobs</div>
        <div><router-link :to="{ path: '/' }">Main page</router-link></div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import "../scss/utilities/_all";

$footer-background-color: $dark;

@import "../scss/layout/footer";

.footer a {
  color: $white;
  &:hover {
    color: $white-ter;
  }
}
</style>
