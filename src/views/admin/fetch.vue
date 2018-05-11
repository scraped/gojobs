<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetch">
          <h2 class="subtitle is-4">Fetch jobs from RGSC</h2>

          <div class="content">
            Fetching jobs is efficient: it remembers what jobs needs fetching & refetching in order to avoid unnecessary parsing. Internally uses Redis.
          </div>

          <div class="columns">
            <div class="column is-half">

              <b-field label="Author(s)"></b-field>
                <b-field>
                  <b-radio v-model="category" native-value="members" type="is-danger">
                    All RGSC Members
                  </b-radio>
                </b-field>

                <b-field>
                  <b-radio v-model="category" native-value="member">
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
              <template v-if="platformDisabled">
                <b-message v-if="category !== 'job'" type="is-info">
                  Rockstar jobs available on all platforms.
                </b-message>
              </template>

              <template v-else>
                <b-field label="Platform"></b-field>

                <b-field>
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
              </template>

              <b-field
                label="Username"
                v-if="category === 'member'">
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

              <b-field
                label="Job ID"
                v-if="category === 'job'">
                <b-input
                  v-model.trim="id"
                  size="is-medium"
                  placeholder="NcO4vELhLEqKahHQy-IWPA"
                  minlength="22"
                  maxlength="22"
                  required>
                </b-input>
              </b-field>

              <b-message v-if="category === 'job'" type="is-warning">
                Take into account that sometimes Rockstar servers can't find the job category its permanent ID.
              </b-message>
            </div>
          </div>

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
        <h2 class="subtitle is-4">Process</h2>
        <div class="content">
          You can upload jobs to the site from here.
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
      category: 'members',
      id: '',
      platform: 'pc',
      period: '',
      limit: 50,
      skip: 0
    }
  },

  methods: {
    async fetch() {
      const {
        category, id, platform, period, limit, skip, forceSkip
      } = this;

      const autoSkip = !forceSkip;

      this.awaiting = true;

      try {
        await this.$http.post('/api/job/fetch', {
          category, key, platform, period, limit, autoSkip, skip
        });
      } catch (error) {
        this.awaiting = false;
      }

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
