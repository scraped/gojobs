<template>
  <main>
    <section class="section">
      <div class="container">
        <h1 class="title">Crews</h1>
        <div class="columns is-multiline">
          <div
            v-for="crew in crews"
            :key="crew.crewId"
            class="column is-one-third-widescreen is-half-tablet">
            <div class="box">
              <img :src="`https://prod.cloud.rockstargames.com/crews/sc/${crew.avatarId}/${crew.crewId}/publish/emblem/emblem_128.png`">
              {{ crew.name }}<br>
              {{ crew.crewId }}
            </div>
          </div>
        </div>
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

