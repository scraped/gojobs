<template>
  <div>
    <bulma-tabs>
      <li :class="{ 'is-active': !by }">
        <router-link :to="{ name: 'main' }">
          Trending
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'rating' }">
        <router-link :to="{ name: 'main', query: { by: 'rating' } }">
          By rating
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'featured' }">
        <router-link :to="{ name: 'main', query: { by: 'featured' } }">
          Featured
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'updated' }">
        <router-link :to="{ name: 'main', query: { by: 'updated' } }">
          Updated
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'newest' }">
        <router-link :to="{ name: 'main', query: { by: 'newest' } }">
          🔥 Newest
        </router-link>
      </li>
    </bulma-tabs>

    <h1 class="title is-4">{{ number }} jobs found</h1>
    <p class="subtitle is-size-6 has-text-grey">
      Page {{ page }}
    </p>

    <div class="columns is-multiline">
      <div
        class="column is-one-third"
        v-for="job in jobs"
        :key="job.jobId">
        <job-card :job="job"></job-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import genQuery from 'src/utils/gen-query.js';

import BulmaTabs from 'src/components/BulmaTabs.vue';
import JobCard from 'src/components/JobCard.vue';

export default {
  components: {
    BulmaTabs,
    JobCard
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'number'
    ]),
    ...mapState('route', {
      page: state => Number(state.query.page) || 1,
      by: state => state.query.by,
      byId: state => state.query.byId,
      gameType: state => state.query.gameType
    })
  }
}
</script>
