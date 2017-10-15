<template>
  <container>
    <columns is-multiline>
      <column is-one-third-desktop is-half-tablet>
        <card-job></card-job>
      </column>
    </columns>
  </container>
</template>

<script>
import CardJob from '../components/CardJob.vue';

export default {
  components: {
    'card-job': CardJob
  },

  data() {
    return {};
  }
};
</script>

<style scoped>

</style>


