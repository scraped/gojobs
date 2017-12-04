<template>
  <div>
    <bulma-hero class="is-dark is-medium" style="background: linear-gradient(to right, hsla(209, 100%, 28%, 0.4), hsla(0, 100%, 20%, 0.4)), url(https://pp.userapi.com/c637620/v637620124/4d7c2/bm9ZtGXtBMA.jpg);background-position: 50% 0%;">
      <div class="hero-body">
        <div class="container">
          <br><h1 class="title">GTA Online Jobs</h1>
        </div>
      </div>
    </bulma-hero>

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
import modes from '../../config/modes';

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
