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
        v-typel="sort"
        @input="sortChanged">
        <option value="">Trending</option>
        <option value="rating">By rating</option>
        <option value="featured">Featured</option>
        <option value="updated">Updated</option>
        <option value="newest">🔥 Newest</option>
      </b-select>

      <h2 class="is-size-4">{{ number }} jobs found</h2>
      <p
        class="subtitle is-size-6 has-text-grey">
        Page {{ page }}
      </p>

      <div class="buttons">
        <router-link
          v-for="(type, i) in modes"
          :key="i"
          v-if="!$route.query.type || $route.query.type === i + 1"
          :to="{ query: { ...$route.query, type: i + 1 } }"
          class="button is-small is-rounded"
          exact-active-class="is-primary">
          <icon-gta :icon="type.icon"></icon-gta>
          <span>{{ type.name }}</span>
          <b-icon v-if="$route.query.type === i + 1"  pack="fa" icon="close" size="is-small"></b-icon>
        </router-link>

        <template v-if="$route.query.type && modes[$route.query.type - 1].modes">
          <router-link
            v-for="(mode, i) in modes[$route.query.type - 1].modes"
            :key="i"
            :to="{ query: { mode: i + i } }"
            class="button is-small is-rounded"
            exact-active-class="is-primary">
            <icon-gta :icon="modes[$route.query.type - 1].icons[i]"></icon-gta>
            <span>{{ mode }}</span>
          </router-link>
        </template>
        <!-- <router-link href="" class="button is-dark is-small is-rounded" style="background: #01498E;">Rockstar</a> -->
      </div>
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
import modes from '@/../config/static/modes';

import JobCard from '@/components/JobCard.vue';
import IconGta from '@/components/IconGta.vue';

export default {
  props: {
    minInfo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      modes
    };
  },

  components: {
    JobCard,
    IconGta
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
