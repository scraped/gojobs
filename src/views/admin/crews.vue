<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <h2 class="subtitle">List</h2>
          <article
            v-for="crew in crews"
            :key="crew.slug"
            class="media"
          >
            <figure class="media-left">
              <p class="image is-64x64">
                <img :src="crew.avatarUrl">
              </p>
            </figure>

            <div class="media-content">
              <p class="has-text-weight-bold">{{crew.name}}</p>
              <p><a :href="`https://socialclub.rockstargames.com/crew/${crew.slug}`" target="_blank">Go to RGSC page</a></p>
              <p class="has-text-grey">Information updated {{crew.lastInfoFetch}}</p>
            </div>
          </article>
          <div
            v-if="!crews.length"
            class="content"
          >
            No crews to show.
          </div>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="box">
        <h2 class="subtitle">Fetch crew info</h2>
          <form @submit.prevent="fetchCrewInfo">
            <b-field label="Crew slug">
              <b-input
                v-model.trim="crewSlug"
                maxlength="30"
                required
              ></b-input>
            </b-field>

            <button
              class="button is-primary"
              :class="{ 'is-loading': loading }"
            >Fetch</button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {mapState} from 'vuex';

export default {
  fetchData({ store, route }) {
    return store.dispatch('crews/fetch', { query: route.query });
  },

  data() {
    return {
      loading: false,
      crewSlug: ''
    };
  },

  computed: {
    ...mapState('crews', [
      'crews'
    ])
  },

  methods: {
    async fetchCrewInfo() {
      this.loading = true;

      try {
        await this.$http.post('/api/crews/fetch', {
          slug: this.crewSlug
        });
      } catch (error) {}

      this.loading = false;
    }
  }
};
</script>

<style>

</style>
