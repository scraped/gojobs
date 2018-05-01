<template>
  <div>
    <div class="box">
      <div class="tabs">
        <ul>
          <router-link :to="{ name: 'main' }" tag="li" active-class="is-active">
            <a>Trending</a>
          </router-link>
          <router-link :to="{ name: 'main', query: { by: 'rating' } }" tag="li">
            <a>By rating</a>
          </router-link>
          <router-link :to="{ name: 'main', query: { by: 'featured' } }" tag="li">
            <a>Featured</a>
          </router-link>
          <router-link :to="{ name: 'main', query: { by: 'updated' } }" tag="li">
            <a>Updated</a>
          </router-link>
          <router-link :to="{ name: 'main', query: { by: 'newest' } }" tag="li">
            <a>🔥 Newest</a>
          </router-link>
        </ul>
      </div>

      <template v-if="number">
        <h1 class="title is-4">
          {{ number }} jobs found
        </h1>
        <p class="subtitle is-size-6 has-text-grey">
          Page {{ page }}
        </p>

        <div class="buttons">
          <router-link :to="{ query: { rockstar: 1 } }" class="button is-rounded is-small" active-class="is-dark">Rockstar Jobs</router-link>
          <router-link :to="{ query: { rockstarverified: 1 } }" class="button is-rounded is-small" active-class="is-dark">Rockstar Verified Jobs</router-link>
        </div>
      </template>
    </div>

    <b-message v-if="!number" type="is-info" size="is-medium">
      No jobs found.
    </b-message>

    <div class="columns is-multiline">
      <div
        class="column is-one-third-widescreen is-half-tablet"
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
