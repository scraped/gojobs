<template>
  <span
    class="icon icon__gta is-unselectable"
    v-html="`&#x${icon};`"
  ></span>
</template>

<script>
export default {
  props: [
    'icon'
  ]
};
</script>

<style lang="scss">
.icon__gta {
  font: {
    family: 'gtav-icon-font';
    size: 0.9em;
  }
}
</style>
