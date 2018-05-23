<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Profile</h1>
        <div class="media box">
          <figure class="media-left">
            <p class="image is-128x128">
              <img class="is-rounded" :src="avatars.large">
            </p>
          </figure>

          <div class="media-content">
            <div class="content">
              <h1 class="title">@{{ username }}
                <span
                  v-if="crew"
                  class="tag is-white is-medium tooltip has-text-weight-normal"
                  :style="`border: 1px solid #${crew.color};`"
                  :data-tooltip="crew.name">
                  {{ crew.tag }}
                </span>
              </h1>
              <!-- <p
                v-if="crew"
                class="has-text-grey">
                Active crew:
                <a :href="`/crews/${crew.slug}`">{{ crew.name }}</a>
              </p> -->
              <div>
                <a
                  class="button is-outlined"
                  :href="`http://ru.socialclub.rockstargames.com/member/${username}`"
                  target="_blank">
                  Go to RGSC profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="authUsername === username && !verified"
      class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <div class="box">
              <h2 class="title is-4">Verification</h2>
              <b-message type="is-info" :closable="false">
                In order to verify your account you need to publish <b>GTA Online Job</b> named
                <div class="mono is-size-1 is-uppercase">{{ jobname }}</div>
                (case doesn't matter)
              </b-message>

              <div class="tags">
                <span class="tag is-info is-medium">Time left: {{ timeLeft }}</span>
              </div>

              <form method="post" @submit.prevent="verify">
                <b-field
                  label="E-mail (optional, but recommended)">
                  <b-input
                    type="email"
                    size="is-large"
                    v-model="email">
                  </b-input>
                </b-field>

                <b-field
                  label="Repeat password *">
                  <b-input
                    type="password"
                    size="is-large"
                    v-model="password"
                    minlength="6"
                    maxlength="30"
                    required>
                  </b-input>
                </b-field>

                <b-field>
                  <b-checkbox v-model="confirm">
                    I confirm that I published a job named <b>{{ jobname }}</b>.
                  </b-checkbox>
                </b-field>

                <div class="buttons">
                  <button
                    class="button is-primary"
                    :disabled="!confirm">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="tabs">
          <ul>
            <li class="is-active">
              <router-link :to="{ name: 'main' }">
                Jobs
              </router-link>
            </li>
          </ul>
        </div>

        <jobs-list></jobs-list>
        <br>
        <!-- <bulma-pagination
          :curr-page="page"
          :total-items="number"
          :load-more-button="true"
          :loading="loading">
        </bulma-pagination> -->
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { userAvatars } from '@/helpers'

import JobsList from '@/components/JobList.vue';
import CustomPagination from '@/components/CustomPagination.vue';

export default {
  title() {
    return `${this.username} Profile`;
  },

  fetchData({ store, route }) {
    const { username } = route.params;

    return Promise.all([
      store.dispatch('profile/fetchUserInfo', { user: username }),
      store.dispatch('jobs/fetch', { query: { by: 'user', byId: username } })
    ]);
  },

  components: {
    JobsList,
    CustomPagination
  },

  data() {
    return {
      password: '',
      confirm: false,
      timeLeft: '',
      interval: 0,
    };
  },

  mounted() {
    setInterval(() => {
      this.timeLeft = moment(this.date).toNow(true);
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  computed: {
    ...mapState('profile', [
      'username',
      'crew'
    ]),

    ...mapState('user', {
      authUsername: 'username'
    }),

    ...mapState('user', [
      'verified',
      'jobname',
      'email',
      'date'
    ]),

    ...mapState('jobs', [
      'number'
    ]),

    avatars() {
      return userAvatars(this.username);
    }
  }
};
</script>

<style lang="scss" scoped>
.mono {
  font-family: "Courier New", monospace;
}
</style>

