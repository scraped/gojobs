<template>
  <div class="columns is-multiline">
    <div class="column">
      <div class="box">
        <form
          method="post"
          @submit.prevent="fetch"
        >
          <h2 class="subtitle">Add job</h2>
          <div class="columns">
            <div class="column is-two-thirds">
              <div class="field">
                <label for="" class="label">Job ID</label>
                <div class="control">
                  <b-input
                    v-model.trim="jobId"
                    size="is-medium"
                    placeholder="vyssmboIF0KPxGArqfW9Ww"
                    minlength="22"
                    maxlength="22"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Platform</label>
                <div class="control">
                  <div class="select is-medium is-fullwidth">
                    <select
                      v-model="jobPlatform"
                      required
                    >
                      <option value="pc">PC</option>
                      <option value="ps4">PS4</option>
                      <option value="xboxone">Xbox One</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="button is-primary button_shadow">Send</button>
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
        <div class="block">
          <form @submit.prevent="retrieveJobs">
            <h2 class="subtitle">Retrieve jobs</h2>
            <div class="field">
              <label class="label">Type</label>
              <div class="control">
                <div class="select">
                  <select
                    v-model="userOrCrew"
                    required
                  >
                    <option value="user">User</option>
                    <option value="crew">Crew</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Platform</label>
              <div class="control">
                <div class="select">
                  <select
                    :model="userOrCrewPlat"
                    required
                  >
                    <option value="pc">PC</option>
                    <option value="ps4">PS4</option>
                    <option value="xboxone">Xbox One</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Username/Crew</label>
              <div class="control">
                <input
                  :model="userOrCrewId"
                  class="input"
                  type="text"
                  placeholder="Username/Crew"
                  required
                >
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary button_shadow">Submit</button>
              </div>
            </div>
          </form>
        </div>
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
      jobPlatform: 'pc',
      jobs: [],
      userOrCrew: '',
      userOrCrewId: '',
      userOrCrewPlat: 'pc',
    };
  },

  async created() {
    const {jobs} = (await this.$http.post('/api/jobs/raw')).data;

    this.jobs = jobs;
  },

  methods: {
    async fetch() {
      const {
        jobId,
        jobPlatform,
      } = this;

      await this.$http.post('/api/jobs/fetch', {jobId, plat: jobPlatform});
    },

    async retrieveJobs() {
      const {userOrCrew, userOrCrewId, userOrCrewPlat} = this;

      await this.$http.post('/api/jobs/fetch', {
        type: userOrCrew,
        id: userOrCrewId,
        plat: userOrCrewPlat,
      });
    },
  },
};
</script>
