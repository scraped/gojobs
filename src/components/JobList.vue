<template>
  <div>
    <h1
      v-if="!minInfo"
      class="title">
      GTA Online Jobs
    </h1>

    <div class="box">
      <b-select
        class="is-pulled-right"
        v-model="sort"
        @input="sortChanged">
        <option value="">Trending</option>
        <option value="rating">By rating</option>
        <option value="featured">Featured</option>
        <option value="updated">Updated</option>
        <option value="newest">🔥 Newest</option>
      </b-select>
      <h2 class="is-size-4">{{ number }} jobs found</h2>
      <p
        v-if="number"
        class="subtitle is-size-6 has-text-grey">
        Page {{ page }}
      </p>

      <template v-if="!minInfo">
        <div class="buttons">
          <router-link :to="{ query: { rockstar: 1 } }" class="button is-rounded is-small" active-class="is-dark">Rockstar Jobs</router-link>
          <router-link :to="{ query: { rockstarverified: 1 } }" class="button is-rounded is-small" active-class="is-dark">Rockstar Verified Jobs</router-link>
        </div>
      </template>
    </div>

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
import genQuery from '@/utils/gen-query.js';

import JobCard from '@/components/JobCard.vue';

export default {
  props: {
    minInfo: {
      type: Boolean,
      default: false
    }
  },

  components: {
    JobCard
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'number'
    ]),

    ...mapState('route', {
      sort: state => state.query.by || '',
      page: state => Number(state.query.page) || 1
    })
  },

  methods: {
    sortChanged(value) {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, by: value }
      });
    }
  }
}
</script>
