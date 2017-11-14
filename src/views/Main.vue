<template>
  <div>
    <div class="hero is-black is-medium" style="background: url(https://pp.userapi.com/c637620/v637620124/4d7d6/HnkIJiM8s7M.jpg); background-position: 10% 50%;">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">GTA Online Jobs</h1>
          <div class="buttons">
            <router-link
              :to="{ path: '/', query: { type: i + 1 } }"
              class="button is-light"
              :class="{ 'is-primary': $route.query.type === i + 1 }"
              v-for="(typeInfo, i) in modes"
              :key="i">
                <icon-gta :icon="typeInfo.icon"></icon-gta>
                <span>{{ typeInfo.name }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="container">
      <jobs-list></jobs-list>
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

// function fetchJobs(query) {
//   return Vue.http.get(`/api/jobs?page=${query.page}`);
// }

export default {
  components: {
    NavMenu,
    SearchJobs,
    JobsList,
    IconGta
  },

  // props: [
  //   'page',
  //   'author',
  //   'crew',
  //   'type',
  //   'mode',
  //   'platform',
  //   'maxpl'
  // ],

  data () {
    return {
      jobs: [],
      modes
    }
  },

  // beforeRouteEnter (to, from, next) {
  //   fetchJobs(to.query)
  //     .then(jobs => {
  //       next(vm => vm.setData(jobs))
  //     })
  //     .catch(error => {
  //       next();
  //     });
  // },

  // beforeRouteUpdate (to, from, next) {
  //   console.log('before update');
  //   fetchJobs(to.query)
  //     .then(jobs => {
  //       this.setData(jobs);
  //     })
  //     .catch(error => {
  //       next();
  //     });
  // },

  methods: {
    // setData (response) {
    //   this.jobs = response.data.jobs;
    // },

    genQuery (obj) {
      return Object.assign({}, this.$route.query, obj);
    },
  }
};
</script>
