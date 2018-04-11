<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-half">
            <div class="box">
              <form
                method="post"
                @submit.prevent="fetch">
                <h2 class="subtitle is-4">Fetch jobs from RGSC</h2>

                <b-field label="Type"></b-field>
                <b-field>
                  <b-radio-button v-model="by" native-value="members">
                    Any
                  </b-radio-button>

                  <b-radio-button v-model="by" native-value="member">
                    By user
                  </b-radio-button>

                  <b-radio-button v-model="by" native-value="crew">
                    By crew
                  </b-radio-button>

                  <b-radio-button v-model="by" native-value="rockstar">
                    R*
                  </b-radio-button>

                  <b-radio-button v-model="by" native-value="rstarverified">
                    R* Verified
                  </b-radio-button>
                </b-field>

                <b-field
                  label="Crew ID"
                  v-if="by === 'crew'">
                  <b-input
                    v-model="crewId"
                    placeholder="Crew digital ID"
                    required>
                  </b-input>
                </b-field>

                <b-field
                  label="Username"
                  v-if="by === 'member'">
                  <b-input
                    v-model="username"
                    placeholder="andreww2012"
                    required>
                  </b-input>
                </b-field>

                <template v-if="by !== 'rockstar' && by !== 'rstarverified'">
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
                </template>

                <b-field label="Period"></b-field>
                <b-field>
                  <b-radio-button v-model="period" native-value="">
                    Any time
                  </b-radio-button>

                  <b-radio-button v-model="period" native-value="lastMonth">
                    Last month
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
                    v-model="limit"
                    size="is-medium">
                  </b-input>
                </b-field>

                <b-field label="To skip"></b-field>
                <div class="field">
                  <b-checkbox v-model="forceSkip">
                    Manually specify how many jobs to skip
                  </b-checkbox>
                </div>

                <div class="field">
                  <b-input
                    v-if="forceSkip"
                    type="number"
                    v-model="skip"
                    size="is-medium">
                  </b-input>
                </div>

                <div class="buttons">
                  <button class="button is-primary">
                    Fetch
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <form
                method="post"
                @submit.prevent="upload">
                <h2 class="subtitle is-4">Upload fetched jobs</h2>
                <div class="field">
                  <b-checkbox v-model="forceUploadAll">
                    Force to upload all jobs (not only new ones)
                  </b-checkbox>
                </div>

                <b-message
                  v-if="forceUploadAll"
                  type="is-warning">
                  <b>Warning:</b> it can take A LOT of time.
                </b-message>

                <button class="button is-primary">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      forceUploadAll: false,
      forceSkip: false,
      by: 'members',
      username: '',
      crewId: '',
      platform: 'pc',
      period: '',
      limit: 100,
      skip: 0
    }
  },

  methods: {
    async fetch() {
      const { by, username, crewId, platform, period, limit, skip, forceSkip } = this;

      const autoSkip = !forceSkip;

      await this.$http.post('/api/job/fetch', {
        by, username, crewId, platform, period, limit, autoSkip, skip
      });
    },

    async upload() {
      const { forceUploadAll } = this;

      await this.$http.post('/api/job/upload', {
        forced: forceUploadAll
      });
    }
  }
};
</script>
