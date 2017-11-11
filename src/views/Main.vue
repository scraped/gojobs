<template>
  <div>
    <nav-menu>
      <h1 class="title">GTA Online Jobs</h1>
      <div class="buttons">
        <router-link
          :to="{ path: '/', query: { type: i } }"
          class="button is-black"
          v-for="(typeInfo, i) in modes"
          :key="i">
            <icon-gta :icon="typeInfo.icon" style="margin-right: 1px;"></icon-gta>
            {{ typeInfo.name }}
        </router-link>
      </div>
    </nav-menu>
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
import NavMenu from '../components/NavMenu.vue';
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';
import IconGta from '../components/IconGta.vue';

function fetchJobs(query) {
  return Vue.http.get(`/api/jobs?page=${query.page}`);
}

export default {
  components: {
    NavMenu,
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
