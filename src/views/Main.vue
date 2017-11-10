<template>
  <div>
    <div class="hero is-dark">
      <div class="container">
        <div class="hero-body">
          <h1 class="title">GTA Online Jobs</h1>
        </div>
      </div>
    </div>
  <div class="container">
    <!-- <search-jobs
      :author="author"
      :crew="crew"
      :platform="platform"
      :type="type"
      :mode="mode"
      :maxpl="maxpl"></search-jobs> -->
    <!-- <br> -->

    <jobs-list
      :jobs="jobs"
      :page="page"
      :crew="crew"
      :author="author"
      :platform="platform"
      :type="type"
      :mode="mode"
      :maxpl="maxpl"></jobs-list>
  </div>
  </div>
</template>

<script>
import Vue from 'vue';
import modes from '../../config/modes';
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';
import IconGta from '../components/IconGta.vue';

function fetchJobs(query) {
  return Vue.http.get(`/api/jobs?page=${query.page}`);
}

export default {
  components: {
    SearchJobs,
    JobsList,
    IconGta
  },

  props: [
    'page',
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ],

  data () {
    return {
      jobs: [],
      modes
    }
  },

  beforeRouteEnter (to, from, next) {
    fetchJobs(to.query)
      .then(jobs => {
        next(vm => vm.setData(jobs))
      })
      .catch(error => {
        next();
      });
  },

  beforeRouteUpdate (to, from, next) {
    console.log('before update');
    fetchJobs(to.query)
      .then(jobs => {
        this.setData(jobs);
      })
      .catch(error => {
        next();
      });
  },

  methods: {
    setData (response) {
      this.jobs = response.data.jobs;
    },

    genQuery (obj) {
      return Object.assign({}, this.$route.query, obj);
    },
  }
};
</script>
