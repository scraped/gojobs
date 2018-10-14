<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-one-third-widescreen is-two-fifths-desktop is-two-fifths-tablet">
        <job-list-filters/>
      </div>

      <div class="column">
        <div class="columns is-multiline">
          <div
            v-for="job in jobs"
            :key="job.jobId"
            class="column is-half-widescreen is-12-tablet"
          >
            <job-card :job="job"/>
          </div>
          <div
            v-if="!count"
            class="column iis-two-thirds-widescreen is-half-tablet"
          >
            <b-notification
              :closable="false"
              type="is-info"
              has-icon
            >
              <div class="notification__header">No jobs found</div>
              <p>Try to change a platform or a game mode.</p>
            </b-notification>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import JobCard from '@/components/JobCard.vue';
import JobListFilters from './JobListFilters.vue';

export default {
  components: {
    JobCard,
    JobListFilters,
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'count',
    ]),

    ...mapState('route', {
      page: state => Number(state.query.page) || 1
    }),
  },
};
</script>
