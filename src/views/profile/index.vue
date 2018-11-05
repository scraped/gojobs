<template>
  <div>
    <section
      v-if="notFound"
      class="section"
    >
      <div class="container">
        <b-message
          v-if="notFound"
          type="is-danger"
        >
          <h2 class="notification__header">Whoops</h2>
          <p>There is no such a user.</p>
        </b-message>
      </div>
    </section>

    <template v-else>
      <section class="section">
        <div class="container">
          <h1 class="title">Profile</h1>

          <div class="media box">
            <div class="media-left">
              <img
                :src="avatars.large"
                :style="crew ? imageOutlined(crew.color, 3) : ''"
                class="rounded"
                width="128"
                height="128"
              >
            </div>

            <div class="media-content">
              <div class="block">
                <h2 class="subtitle is-size-4">@{{user.username}}
                  <span
                    v-if="crew"
                    :style="`border: 1px solid #${crew.color};`"
                    :data-tooltip="crew.name"
                    class="tag is-white is-medium tooltip has-text-weight-normal"
                  >
                    {{crew.tag}}
                  </span>
                </h2>
                <h3 class="has-text-grey is-size-6">
                  <template v-if="crew">{{crew.name}}</template>
                  ·
                  <a
                    :href="`https://socialclub.rockstargames.com/member/${user.username}`"
                    target="_blank"
                  >
                    Go to their RGSC profile
                  </a>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="authUsername === user.username && !verified"
        class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-half">
              <div class="box">
                <h2 class="title is-4">Verification</h2>
                <b-notification
                  type="is-info"
                  has-icon
                  :closable="false"
                >
                  <div class="notification__header">Verification code</div>
                  In order to verify your account you need to publish <b>GTA Online Job</b> named
                  <div class="mono is-size-1 is-uppercase">{{ jobname }}</div>
                  (case doesn't matter)
                </b-notification>

                <div class="tags">
                  <span class="tag is-light is-medium">Time left: {{ timeLeft }}</span>
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

                    <button
                      class="button is-danger is-outlined"
                    >
                      Cancel registration
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
              <li>
                <router-link :to="{ name: 'main' }">
                  Collections
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'main' }">
                  Events
                </router-link>
              </li>
            </ul>
          </div>

          <job-list :min-info="true"></job-list>
          <!-- <br> -->
          <!-- <bulma-pagination
            :curr-page="page"
            :total-items="number"
            :load-more-button="true"
            :loading="loading">
          </bulma-pagination> -->
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {userAvatars} from '@/helpers';
import {imageOutlined} from '@/mixins';

import JobList from '@/components/job-list/JobList.vue';
import CustomPagination from '@/components/CustomPagination.vue';

export default {
  metaInfo() {
    return {
      title: this.title,
    };
  },

  fetchData({store, route}) {
    const {username} = route.params;

    return Promise.all([
      store.dispatch('profile/fetchUserInfo', {username}),
      store.dispatch('jobs/fetch', {user: username}),
    ]);
  },

  components: {
    JobList,
    CustomPagination,
  },

  mixins: [
    imageOutlined,
  ],

  data() {
    return {
      password: '',
      confirm: false,
      timeLeft: '',
      interval: 0,
    };
  },

  computed: {
    notFound() {
      return !this.user;
    },

    ...mapState('profile', [
      'user',
      'crew',
    ]),

    ...mapState('user', {
      authUsername: 'username',
    }),

    ...mapState('user', [
      'verified',
      'jobname',
      'email',
      'date',
    ]),

    ...mapState('jobs', [
      'number',
    ]),

    ...mapState('route', {
      page: state => Number(state.query.page) || 1,
      currUsername: state => state.params.username,
    }),

    avatars() {
      return userAvatars(this.user.username);
    },

    title() {
      return `${this.currUsername}'s profile`;
    },
  },

  mounted() {
    setInterval(() => {
      // this.timeLeft = `moment`(this.date).toNow(true);
      this.timeLeft = '';
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style lang="scss" scoped>
.mono {
  font-family: "Courier New", monospace;
}
</style>

