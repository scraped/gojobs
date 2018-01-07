<template>
  <blockquote>
    azaza
  </blockquote>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

// import BulmaHero from '@components/BulmaHero.vue';
// import JobsList from '@components/JobList.vue';
// import BulmaPagination from '@components/BulmaPagination.vue';

export default {
  // fetchData({ store, route }) {
  //   return store.dispatch('jobs/fetch', { query: route.query });
  // },

  components: {
    // BulmaHero,
    // JobsList,
    // BulmaPagination
  },

  // data() {
  //   return {
  //     loading: false
  //   };
  // },

  // computed: {
  //   ...mapState('jobs', [
  //     'jobs',
  //     'amount'
  //   ]),
  //   ...mapState('route', {
  //     page: state => Number(state.query.page) || 1
  //   })
  // },

  // methods: {
  //   async fetchAndAppend() {
  //     const { query } = this.$store.state.route;
  //     await store.dispatch('jobs/fetch', { query, append: true });
  //     this.$router.replace({ name: 'main', query: { page: this.page + 1 } })
  //   }
  // }
};
</script>
