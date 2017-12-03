<template>
  <div>
    <div class="hero is-black is-medium" style="background: url(https://pp.userapi.com/c637620/v637620124/4d7c2/bm9ZtGXtBMA.jpg); background-position: 50% 35%;">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">GTA Online Jobs</h1>
        </div>
      </div>
    </div>

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
    SearchJobs,
    JobsList,
    IconGta
  },

  data () {
    return {
      modes
    }
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
