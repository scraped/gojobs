<template>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-desktop">
          <div class="title">Search</div>
        </div>
        <div class="column">
          <jobs-list :page="currPage"></jobs-list>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import JobsList from '../components/JobsList.vue';

export default {
  components: {
    JobsList
  },

  data() {
    return {
      currPage: Number(this.$route.query.page) || 1
    };
  },
};
</script>
