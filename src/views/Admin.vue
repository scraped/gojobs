<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-half">
            <form
              method="post"
              @submit.prevent="fetch">
            <h2 class="subtitle is-4">Fetch jobs</h2>

            <b-field label="What jobs to fetch"></b-field>
            <b-field>
              <b-radio-button v-model="by" native-value="members">
                All members
              </b-radio-button>

              <b-radio-button v-model="by" native-value="member">
                Member
              </b-radio-button>

              <b-radio-button v-model="by" native-value="crew">
                Crew
              </b-radio-button>

              <b-radio-button v-model="by" native-value="rockstar">
                Rockstar
              </b-radio-button>

              <b-radio-button v-model="by" native-value="rstarverified">
                Rockstar Verified
              </b-radio-button>
            </b-field>

            <b-field
              label="Crew digital ID"
              v-if="by === 'crew'">
              <b-input v-model="id"></b-input>
            </b-field>

            <b-field
              label="Username"
              v-if="by === 'member'">
              <b-input v-model="id"></b-input>
            </b-field>

            <b-field label="Platform"></b-field>
            <b-field>
              <b-radio-button v-model="platform" native-value="pc">
                PC
              </b-radio-button>

              <b-radio-button v-model="platform" native-value="ps4">
                PS4
              </b-radio-button>

              <b-radio-button v-model="platform" native-value="xbox">
                Xbox One
              </b-radio-button>
            </b-field>

            <b-field label="Period"></b-field>
            <b-field>
              <b-radio-button v-model="period" native-value="">
                Any time
              </b-radio-button>

              <b-radio-button v-model="period" native-value="today">
                Today
              </b-radio-button>

              <b-radio-button v-model="period" native-value="last7">
                Last 7 days
              </b-radio-button>

              <b-radio-button v-model="period" native-value="lastMonth">
                Last month
              </b-radio-button>
            </b-field>

            <b-field label="Limit">
              <b-input type="number" v-model="limit"></b-input>
            </b-field>

            <b-field label="To skip">
              <b-input type="number" v-model="skip"></b-input>
            </b-field>

            <div class="buttons">
              <button class="button is-primary is-outlined">
                Fetch
              </button>
            </div>
            </form>
          </div>
          <div class="column">
            <form
              method="post"
              @submit.prevent="upload">
              <h2 class="subtitle is-4">Upload jobs</h2>
              <div class="field">
                <b-checkbox v-model="forced">
                   Force to upload all jobs (it can take a lot of time)
                </b-checkbox>
              </div>
              <button class="button is-primary">
                Upload raw jobs
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      forced: false,
      by: 'members',
      id: '',
      platform: 'pc',
      period: '',
      limit: 500,
      skip: 0
    }
  },

  methods: {
    async fetch() {
      console.l
      const { by, id, platform, period, limit, skip } = this;

      const response = (await this.$axios.post('/api/job/fetch', { by, id, platform, period, limit, skip })).data;

      // this.$snackbar.open(response);
    },

    async upload() {
      const { forced } = this;

      console.log('this.axios:', this.$axios);
      console.log('axios:', axios);

      const response = (await Vue.prototype.$axios.post('/api/job/upload', { forced })).data;

      // this.$snackbar.open(response);
    }
  }
};
</script>
