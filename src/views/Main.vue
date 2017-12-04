<template>
  <div>
    <bulma-hero class="is-medium" text="GTA Online Jobs"></bulma-hero>

    <section class="section">
      <div class="container">
        <jobs-list></jobs-list>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store';

import BulmaHero from '../components/BulmaHero.vue';
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';
import IconGta from '../components/IconGta.vue';

async function fetchJobs(to, from, next) {
  let { page } = to.query;
  await store.dispatch('jobs/fetch', { page });
  next();
}

export default {
  components: {
    BulmaHero,
    SearchJobs,
    JobsList,
    IconGta
  },

  computed: {
    jobs() {
      return this.$store.state.jobs;
    }
  },

  beforeRouteEnter: fetchJobs,

  beforeRouteUpdate: fetchJobs
};
</script>
