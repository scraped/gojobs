<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetch">
          <h2 class="subtitle">Fetch jobs</h2>
          <hr>

          <b-notification :closable="false">
            You can fetch either job bunches (up to 20 jobs per request, but this won't give you complete information about the job) or "extended" jobs (this will take you one request per job).
          </b-notification>

          <div class="columns">
            <div class="column is-half">
              <b-field label="Type">
                <b-checkbox v-model="bunches" @input="bunchesCheckboxEvent">
                  Fetch bunches
                </b-checkbox>
              </b-field>

              <b-field label="Author(s)"></b-field>
              <b-field>
                <b-radio v-model="category" native-value="all" @input="authorChangeEvent">
                  {{ categoryAllName }}
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="user" @input="authorChangeEvent">
                  Specific User
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="crew" @input="authorChangeEvent">
                  Specific Crew
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="job" @input="authorChangeEvent" :disabled="bunches">
                  Specific Job
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="rockstar" @input="authorChangeEvent">
                  Rockstar
                </b-radio>
              </b-field>

              <b-field>
                <b-radio v-model="category" native-value="rockstarverified" @input="authorChangeEvent">
                  Rockstar Verified
                </b-radio>
              </b-field>
            </div>

            <div class="column">
              <b-field label="Strict mode">
                <b-checkbox
                  v-model="strict"
                  :disabled="bunches">
                  Enable strict mode
                </b-checkbox>
              </b-field>

              <b-field label="Platform"></b-field>

              <div
                v-if="platformDisabled"
                class="field has-text-grey is-italic">
                Not applicable.
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

              <template v-if="category === 'job'">
                <b-field
                  label="Job ID"
                  key="permId">
                  <b-input
                    v-model.trim="id"
                    size="is-medium"
                    minlength="22"
                    maxlength="22"
                    required>
                  </b-input>
                </b-field>

                <!-- <b-notification
                  type="is-warning"
                  :closable="false"
                  has-icon>
                  Take into account that sometimes job won't be available by its "permanent" or even "actual" ID: rockstar servers returns either empty object or an empty object with "latest" key set to true.
                </b-notification> -->
              </template>
            </div>
          </div>

          <!-- <template v-if="bunches">
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
          </template> -->

          <b-field
            v-if="category !== 'job'"
            label="Requests limit">
            <b-input
              type="number"
              v-model.number="reqLimit"
              size="is-medium"
              min="1"
              max="200">
            </b-input>
          </b-field>

          <div class="buttons">
            <button class="button is-primary">Fetch<template v-if="bunches"> bunches</template></button>
            <a
              v-if="category === 'job' && id.length === 22"
              class="button is-light"
              :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${id}`"
              target="_blank">
              Proceed to RGSC job page
            </a>
          </div>
        </form>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="box">
        <form @submit.prevent="process">
          <h2 class="subtitle">Process jobs</h2>
          <hr>

          <div class="content">
            <p>You can upload jobs to the site from here.</p>

            <div class="field">
              <b-checkbox v-model="processAny">
                Process any jobs
              </b-checkbox>
            </div>

            <b-field label="Limit">
              <b-input
                type="number"
                v-model.number="processLimit"
                size="is-medium"
                min="1"
                max="3000">
              </b-input>
            </b-field>

            <button class="button is-primary">Process</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bunches: false,
      strict: false,
      category: 'all',
      id: '',
      platform: 'pc',
      period: '',
      reqLimit: 200,
      processAny: false,
      processLimit: 3000
    }
  },

  methods: {
    bunchesCheckboxEvent(value) {
      if (value && this.category === 'job') {
        this.category = 'all';
      }
    },

    authorChangeEvent() {
      this.id = '';
    },

    async fetch() {
      const {
        bunches, strict, category, id, platform, period, reqLimit
      } = this;

      await this.$http.post('/api/job/fetch', {
        bunches,
        strict: Number(strict),
        category,
        id,
        platform,
        period,
        reqLimit
      });
    },

    async process() {
      const {
        processAny: any,
        processLimit: limit
      } = this;

      await this.$http.post('/api/job/upload', {
        any,
        limit
      });
    }
  },

  computed: {
    platformDisabled() {
      const { category } = this;
      return category === 'rockstar' || category === 'rockstarverified';
    },

    categoryAllName() {
      return this.bunches
        ? 'RGSC Members'
        : 'Any jobs';
    }
  }
};
</script>
