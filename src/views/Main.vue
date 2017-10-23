<template>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-desktop">
          <div class="title">Search</div>
        </div>
        <div class="column">
          <div class="subtitle">Page {{ currPage }}</div>
          <div class="columns is-multiline">
            <template v-for="job in jobs">
              <div class="column is-half" :key="job.jobId">
                <card-job :job-obj="job"></card-job>
              </div>
            </template>
          </div>

          <div class="hero is-dark">
            <div class="hero-body">
              <pagination
                :curr-page="currPage"
                :total-items="228"
                @page-changed="fetchJobs"></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CardJob from '../components/CardJob.vue';
import Pagination from '../components/Pagination.vue';

export default {
  components: {
    CardJob,
    Pagination
  },

  data() {
    return {
      jobs: [],
      currPage: Number(this.$route.query.page) || 1
    };
  },

  created: function() {
    this.fetchJobs(this.currPage);
  },

  methods: {
    fetchJobs (page) {
      this.$router.push({ path: '/', query: { page: page }});
      this.currPage = page;

      this.$http.get(`/api/jobs?page=${page}`)
        .then(response => {
          this.jobs = response.data.jobs;
        })
        .catch(error => {
          console.warn('Cannot get jobs', error);
        });
    }
  },
};
</script>

<style scoped>

</style>


