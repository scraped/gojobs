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

      <div class="box">
        <h2 class="subtitle">Jobs</h2>

        <article
          v-for="job in jobs"
          :key="job.jobId"
          class="media"
        >
          <figure class="media-left">
            <p class="image" style="width: 100px;">
              <img :src="job.job.Metadata.thumbnail">
            </p>
          </figure>

          <div class="media-content">
            <div class="subtitle is-size-6 is-marginless">
              <span class="has-text-weight-bold">{{job.job.Metadata.name}}</span>
              <span
                class="tag"
                :class="job.processed ? 'has-text-success' : 'has-text-danger'"
              >Processed</span>
              <span
                class="tag"
                :class="job.uploaded ? 'has-text-success' : 'has-text-danger'"
              >Uploaded</span>
            </div>

            <p>
              <router-link
                :to="{
                  name: 'profile',
                  params: { username: job.job.Metadata.nickname }
                }"
              >@{{job.job.Metadata.nickname}}</router-link>
            </p>
          </div>
        </article>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="box">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  fetchData({ store, route }) {
    return store.dispatch('crews/fetch', { query: route.query });
  },

  data() {
    return {
      jobId: '',
      jobs: []
    }
  },

  async created() {
    const {jobs} = (await this.$http.post('/api/jobs/raw')).data;

    this.jobs = jobs;
  },

  methods: {
    async fetch() {
      const {jobId} = this;

      await this.$http.post('/api/jobs/fetch', {jobId});
    }
  }
};
</script>
