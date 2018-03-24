<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="media">
          <figure class="media-left">
            <p class="image is-128x128">
              <img class="is-rounded" :src="avatars.large">
            </p>
          </figure>

          <div class="media-content">
            <div class="content">
              <h1 class="title">@{{ username }}</h1>
              <div>
                <a
                  class="button is-primary is-outlined"
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
        <bulma-pagination
          :curr-page="page"
          :total-items="number"
          :load-more-button="true"
          :loading="loading">
        </bulma-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import {userAvatars} from 'src/helpers'

import JobsList from 'src/components/JobList.vue';
import BulmaPagination from 'src/components/BulmaPagination.vue';

export default {
  title() {
    return this.username + ' Profile';
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
    BulmaPagination
  },

  computed: {
    ...mapState('profile', [
      'username'
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

<style>

</style>
