<template>
  <span
    class="icon icon-gta is-unselectable"
    v-html="`&#x${icon};`"></span>
</template>

<script>
export default {
  props: [
    'icon'
  ]
};
</script>

<style lang="scss">
.icon-gta {
  vertical-align: top;
  font: {
    family: 'gtav-icon-font';
    size: 0.95em;
  }
}
</style>
