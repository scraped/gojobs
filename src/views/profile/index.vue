<template>

</template>

<script>
import { mapState } from 'vuex';

export default {
  computed {
    ...mapState('user', [
      'username',
      'jobname'
    ])
  }
}
</script>

<style>

</style>
