<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetchBunches">
          <h2 class="subtitle">Fetch job bunches</h2>
          <hr>
          <div class="columns">
            <div class="column is-half">

              <b-field label="Author(s)"></b-field>
              <b-field>
                <b-radio v-model="category" native-value="all">
                  RGSC Members
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="user">
                  Specific User
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="crew">
                  Specific Crew
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="rockstar">
                  Rockstar
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="rockstarverified">
                  Rockstar Verified
                </b-radio>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Platform"></b-field>

              <div
                v-if="platformDisabled"
                class="field has-text-grey is-italic">Not applicable.
              </div>

              <b-field v-else>
                <b-radio-button v-model="platform" native-value="pc">
                  PC
                </b-radio-button>

                <b-radio-button v-model="platform" native-value="ps4">
                  PS4
                </b-radio-button>

                <b-radio-button v-model="platform" native-value="xboxone">
                  XB1
                </b-radio-button>
              </b-field>

              <b-field
                label="Username"
                v-if="category === 'user'">
                <b-input
                  v-model.trim="id"
                  size="is-medium"
                  placeholder="andreww2012"
                  required>
                </b-input>
              </b-field>

              <b-field
                label="Crew ID"
                v-if="category === 'crew'">
                <b-input
                  v-model.trim="id"
                  size="is-medium"
                  placeholder="Crew digital ID"
                  required>
                </b-input>
              </b-field>
            </div>
          </div>

          <b-field label="Period"></b-field>
          <b-field>
            <b-radio-button v-model="period" native-value="">
              Any time
            </b-radio-button>

            <b-radio-button v-model="period" native-value="lastMonth">
              Last 30 days
            </b-radio-button>

            <b-radio-button v-model="period" native-value="last7">
              Last 7 days
            </b-radio-button>

            <b-radio-button v-model="period" native-value="today">
              Today
            </b-radio-button>
          </b-field>

          <b-field label="Bunches Limit (100 is maximum)">
            <b-input
              type="number"
              v-model.number="limit"
              size="is-medium"
              min="1"
              max="100">
            </b-input>
          </b-field>

          <!-- <b-field label="To skip"></b-field>
          <div class="field">
            <b-checkbox v-model="forceSkip">
              Manually specify how many jobs to skip
            </b-checkbox>
          </div>

          <div class="field">
            <b-input
              v-if="forceSkip"
              type="number"
              v-model.number="skip"
              size="is-medium">
            </b-input>
          </div> -->

          <button
            class="button is-primary"
            :class="{ 'is-loading': awaiting }"
            :disabled="awaiting">
            Fetch
          </button>
        </form>
      </div>

      <div class="box">
        <form
          method="post"
          @submit.prevent="fetchSingle">
          <h2 class="subtitle">Fetch by ID</h2>
          <hr>

          <b-field
            label="Job ID *"
            key="permId">
            <b-input
              v-model.trim="jobId"
              size="is-medium"
              minlength="22"
              maxlength="22"
              required>
            </b-input>
          </b-field>

          <b-notification
            type="is-warning"
            :closable="false"
            has-icon>
            Take into account that sometimes job won't be available by its "permanent" or even "actual" ID: rockstar servers returns either empty object or an empty object with "latest" key set to true.
          </b-notification>

          <div class="buttons">
            <button class="button is-primary">Fetch</button>
            <a
              v-if="jobId.length === 22"
              class="button is-light"
              :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/z2iGq4xJHEy7C69toKa75w`"
              target="_blank">
              Proceed to RGSC job page
            </a>
          </div>
        </form>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="box">
        <h2 class="subtitle is-4">Further fetching</h2>
        <div class="content">
          <p>All jobs need further fetching to restore all information.</p>

          <!-- <b-field label="Proxy server">
            <b-input
              v-model.trim="proxy"
              size="is-medium"
              placeholder="127.0.0.1:8080">
            </b-input>
          </b-field> -->

          <form @submit.prevent="furtherFetch">
            <button
              class="button is-primary"
              :class="{ 'is-loading': awaiting }"
              :disabled="awaiting">
              Fetch
            </button>
          </form>
        </div>
      </div>

      <div class="box">
        <h2 class="subtitle is-4">Processing</h2>
        <div class="content">
          <p>You can upload jobs to the site from here.</p>

          <form @submit.prevent="process">
            <button
              class="button is-primary"
              :class="{ 'is-loading': awaiting }"
              :disabled="awaiting">
              Process
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      awaiting: false,
      forceSkip: false,
      category: 'all',
      id: '',
      jobId: '',
      platform: 'pc',
      period: '',
      limit: 100,
      skip: 0,
      proxy: ''
    }
  },

  methods: {
    async fetchBunches() {
      const {
        category, id, platform, period, limit, skip, forceSkip
      } = this;

      const autoSkip = !forceSkip;

      await this.$http.post('/api/job/fetch', {
        category, id, platform, period, limit, autoSkip, skip
      });
    },

    async fetchSingle() {
      const { jobId } = this;

      await this.$http.post('/api/job/fetchextended', { jobId });
    },

    async furtherFetch() {
      const { proxy } = this;

      await this.$http.post('/api/job/fetchextended', { proxy });
    },

    async process() {
      await this.$http.post('/api/job/upload');
    }
  },

  computed: {
    platformDisabled() {
      const { category } = this;
      return category === 'rockstar' || category === 'rockstarverified';
    }
  }
};
</script>
