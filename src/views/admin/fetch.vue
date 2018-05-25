<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetch">
          <h2 class="subtitle is-4">Fetch job bunches</h2>
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
                <b-radio v-model="category" native-value="job">
                  Specific Job
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

          <template v-if="category === 'job'">
              <b-field
                label="Job Permanent ID *"
                key="permId">
                <b-input
                  v-model.trim="id"
                  size="is-medium"
                  minlength="22"
                  maxlength="22"
                  required>
                </b-input>
              </b-field>

              <b-field
                label="Job Current ID"
                key="currId">
                <b-input
                  v-model.trim="idCurr"
                  size="is-medium"
                  minlength="22"
                  maxlength="22">
                </b-input>
            </b-field>

            <b-notification
              v-if="category === 'job'"
              type="is-warning"
              :closable="false"
              has-icon>
              Take into account that sometimes Rockstar servers can't find the job category its permanent ID.
            </b-notification>
          </template>


          <template v-if="category !== 'job'">
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

            <b-field label="Limit">
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
          </template>

          <div class="buttons">
            <button
              class="button is-primary"
              :class="{ 'is-loading': awaiting }"
              :disabled="awaiting">
              Fetch
            </button>
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
      idCurr: '',
      platform: 'pc',
      period: '',
      limit: 50,
      skip: 0,
      proxy: ''
    }
  },

  methods: {
    async fetch() {
      const {
        category, id, idCurr, platform, period, limit, skip, forceSkip
      } = this;

      const autoSkip = !forceSkip;

      this.awaiting = true;

      await this.$http.post('/api/job/fetch', {
        category, id, platform, period, limit, autoSkip, skip
      });

      this.awaiting = false;
    },

    async furtherFetch() {
      const { proxy } = this;

      this.awaiting = true;

      await this.$http.post('/api/job/fetchextended', { proxy });

      this.awaiting = false;
    },

    async process() {
      this.awaiting = true;

      await this.$http.post('/api/job/upload');

      this.awaiting = false;
    }
  },

  computed: {
    platformDisabled() {
      const { category } = this;
      return category === 'rockstar' || category === 'rockstarverified' || category === 'job'
    }
  }
};
</script>
