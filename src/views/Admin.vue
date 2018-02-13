<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <h2 class="subtitle is-4">Fetch jobs</h2>

        <b-field label="What jobs to fetch"></b-field>
        <b-field>
          <b-radio-button v-model="by" native-value="members">
            Members
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
          label="Crew digital ID or username"
          v-if="by === 'crew' || by === 'members'">
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

        <a
          class="button is-primary is-outlined"
          href="/api/jobs/upload"
          target="_blank">Upload all raw jobs</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      by: 'members',
      platform: 'pc'
    }
  }
};
</script>
