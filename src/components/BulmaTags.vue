<template>
  <div class="tags">
    <span class=""
  </div>
</template>

<script>
import BulmaTag from './BulmaTag.vue';

export default {
  components: {
    BulmaTag
  },

  props: {
    tags: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="scss">

</style>
