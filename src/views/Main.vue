<template>
  <div>
    <div class="hero is-black is-medium" style="background: url(https://pp.userapi.com/c637620/v637620124/4d7c2/bm9ZtGXtBMA.jpg); background-position: 50% 35%;">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">GTA Online Jobs</h1>
          <!-- <div class="buttons">
            <router-link
              :to="{ path: '/', query: { type: i + 1 } }"
              class="button is-dark is-inverted is-outlined is-rounded"
              :class="{ 'is-primary': $route.query.type === i + 1 }"
              v-for="(typeInfo, i) in modes"
              :key="i">
                <span>{{ typeInfo.name }}</span>
            </router-link>
          </div> -->
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
import NavMenu from '../components/NavMenu.vue';
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';
import IconGta from '../components/IconGta.vue';

export default {
  components: {
    NavMenu,
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

  async beforeRouteEnter(to, from, next) {
    await store.dispatch('jobs/fetch', { page: to.query.page });
    next();
  },

  async beforeRouteUpdate(to, from, next) {
    await store.dispatch('jobs/fetch', { page: to.query.page });
    next();
  },

  methods: {
    genQuery (obj) {
      return Object.assign({}, this.$route.query, obj);
    },
  }
};
</script>
