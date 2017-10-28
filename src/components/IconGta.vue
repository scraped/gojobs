<template>
  <span
    class="icon icon-gta is-unselectable"
    v-html="`&#x${icon};`"
    ></span>
</template>

<script>
export default {
  props: [
    'icon'
  ]
}
</script>

<style lang="scss">
  .icon-gta {
    font-family: 'gtav-icon-font';
  }

  a:hover .icon-gta {
    text-decoration: none !important;
  }
</style>
