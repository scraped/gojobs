<template>
  <div class="has-text-centered">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@bulma/utilities/_all";

.loading::after {
  content: "";
  display: inline-block;
  width: 3rem;
  height: 3rem;
  border: 2px solid $primary;
  border-radius: 100%;
  border-top-color: transparent;
  border-right-color: transparent;
  margin: 5rem 0;
  animation: spinAround 600ms infinite linear;
}
</style>
