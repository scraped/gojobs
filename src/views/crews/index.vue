<template>
  <main>
    <section class="section">
      <div class="container">
        <h1 class="title">Crews</h1>
        <div class="columns is-multiline">
          <div
            v-for="crew in crews"
            :key="crew.crewId"
            class="column is-one-quarter-widescreen is-half-tablet"
          >
            <div class="box">
              <div class="block has-text-centered">
                <figure class="image is-128x128 is-inline-block">
                  <img
                    :src="crewAvatarUrl(crew.avatarId, crew.crewId)"
                    :style="`box-shadow: 0 0 0 4px #ffffff, 0 0 0 8px #${crew.color}`"
                    class="is-rounded"
                  >
                </figure>
              </div>

              <div class="block">
                <div class="subtitle has-text-centered">{{crew.name}}</div>
                <p class="is-size-7 has-text-centered">{{crew.memberCount}} members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import {mapState} from 'vuex';

export default {
  metaInfo() {
    return {
      title: 'Crew list',
    };
  },

  fetchData({store, route}) {
    return store.dispatch('crews/fetch', {query: route.query});
  },

  computed: {
    ...mapState('crews', [
      'crews',
    ]),
  },

  methods: {
    crewAvatarUrl(avatarId, crewId) {
      return `https://prod.cloud.rockstargames.com/crews/sc/${avatarId}/${crewId}/publish/emblem/emblem_128.png`
    },
  },
};
</script>

