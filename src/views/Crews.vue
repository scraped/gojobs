<template>
  <main>
    <section class="section">
      <div class="container">
        <h1 class="title">Crews</h1>
        <ul v-for="crew in crews" :key="crew.crewId">
          <li>{{ crew }}</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex';

export default {
  fetchData({ store, route }) {
    return store.dispatch('crews/fetch', { query: route.query });
  },

  computed: {
    ...mapState('crews', [
      'crews'
    ])
  }
};
</script>

