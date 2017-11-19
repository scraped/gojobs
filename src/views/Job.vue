<template>
  <div>
    <div class="hero is-dark">
      <div class="hero-body">
        <h1 class="subtitle has-text-centered">No images</h1>
      </div>
    </div>
    <br>

    <div class="container">
      <div class="media">
        <div class="media-left">
          <figure class="image is-2by1">
            <img :src="job.image" :alt="job.name">
          </figure>
        </div>
        <div class="media-content">
          <h1 class="title">
            <icon-gta :icon="modes[job.job.gameType - 1].modes[job.job.gameMode - 1].icon" class="is-size-4"></icon-gta>
            {{ job.name }}
          </h1>
          <p v-html="job.desc"></p>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store';
import modes from '../../config/modes';
import IconGta from '../components/IconGta.vue';

export default {
  components: {
    IconGta
  },

  data() {
    return {
      modes
    }
  },

  computed: {
    job() {
      return this.$store.state.job.job;
    }
  },

  async beforeRouteEnter(to, from, next) {
    await store.dispatch('job/fetch', { id: to.params.id });
    next();
  },

  async beforeRouteUpdate(to, from, next) {
    await store.dispatch('job/fetch', { id: to.params.id });
    next();
  }
}
</script>

<style>
.agile__dot button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 100%;
  border: 0;
  font-size: 0;
}
</style>
