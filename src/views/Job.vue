<template>
  <div>
    <div class="hero is-dark">
      <div class="hero-body">
        <agile :infinite="false" :arrows="false" :nextArrow="'test'" :prevArrow="'test'">
          <div class="slide">
            <img :src="job.image">
          </div>
          <div class="slide">
            <img :src="job.image">
          </div>
          <div class="slide">
            <img :src="job.image">
          </div>
        </agile>

      </div>
    </div>
    <h1 class="title is-4">{{ job.name }}</h1>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  created() {
    this.fetchJob();
  },

  methods: {
    fetchJob() {
      this.$store.dispatch('job/fetch');
    }
  },

  computed: {
    job() {
      return this.$store.state.job.job;
    }
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
