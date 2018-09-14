<template>
  <div class="columns is-multiline">
    <div class="column is-two-thirds">
      <div class="box">
        <h2 class="subtitle">
          List
          <span
            class="is-pulled-right button is-small"
            @click="updateList"
          >Update</span>
        </h2>
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
              <p>
                <span class="has-text-weight-bold">{{crew.name}}</span>
                <span class="tag is-white" :style="`border: 2px solid #${crew.color};`">{{crew.tag}}</span>
                <span class="tag is-white has-text-grey">{{crew.slug}}</span>
              </p>
              <p class="is-italic">
                "{{crew.motto}}"
              </p>
              <p>{{crew.desc}}</p>
              <p class="has-text-grey is-size-7">
                {{crew.count || '?'}} members · Information updated {{fromNow(crew.lastInfoFetch)}}
              </p>
              <br>
              <div class="buttons">
                <a
                  class="button is-primary is-small"
                   :href="`https://socialclub.rockstargames.com/crew/${crew.slug}`"
                   target="_blank"
                >Go to RGSC page</a>
                <span
                  class="button is-small"
                  @click="fetchCrewInfoSpecific($event, crew.slug)"
                >Refetch info</span>
              </div>
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
    <div class="column">
      <div class="box">
        <h2 class="subtitle">Fetch crew info</h2>
          <form @submit.prevent="fetchCrewInfoForm">
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
    fromNow(date) {
      return moment(date).fromNow();
    },

    async updateList(e) {
      const {target} = e;

      const initialText = target.innerHTML;

      const changeButton = (newClass, newText) => {
        target.setAttribute('disabled', '');
        target.classList.add(newClass);
        target.innerHTML = newText;
        setTimeout(() => {
          target.classList.remove(newClass);
          target.innerHTML = initialText;
          target.removeAttribute('disabled');
        }, 5000);
      };

      target.classList.add('is-loading');

      try {
        await this.$store.dispatch('crews/fetch', { query: {} });
        changeButton('is-success', 'Success');
      } catch (error) {
        console.log(error);
        changeButton('is-danger', 'Error');
      }

      target.classList.remove('is-loading');
    },

    async fetchCrewInfo(slug) {
      await this.$http.post('/api/crews/fetch', {slug});
    },

    async fetchCrewInfoSpecific(e, slug) {
      const {target} = e;

      target.classList.add('is-loading');

      try {
        await this.fetchCrewInfo(slug);
        target.setAttribute('disabled', true);
      } catch (error) {}

      target.classList.remove('is-loading');
    },

    async fetchCrewInfoForm() {
      this.loading = true;

      try {
        await this.fetchCrewInfo(this.crewSlug);
      } catch (error) {}

      this.loading = false;
    }
  }
};
</script>
