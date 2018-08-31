<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetch"
        >
          <h2 class="subtitle">Add job</h2>
          <b-field grouped>
            <b-input
              v-model.trim="jobId"
              size="is-medium"
              placeholder="vyssmboIF0KPxGArqfW9Ww"
              minlength="22"
              maxlength="22"
              :has-counter="false"
              expanded>
            </b-input>
            <p class="control">
              <button class="button is-primary is-medium is-rounded">
                <b-icon icon="angle-right"></b-icon>
              </button>
            </p>
          </b-field>

        </form>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="box">
        <form @submit.prevent="process">
          <h2 class="subtitle">Process jobs</h2>

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
      jobId: '',
      processAny: false,
      processLimit: 3000
    }
  },

  methods: {
    async fetch() {
      const {jobId} = this;

      await this.$http.post('/api/job/fetch', {jobId});
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
  }
};
</script>
