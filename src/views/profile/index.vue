<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="media">
          <figure class="media-left">
            <p class="image is-128x128">
              <img :src="avatarLarge">
            </p>
          </figure>

          <div class="media-content">
            <h1 class="title">{{ username }} </h1>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
  fetchData({ store, route }) {
    const { username } = route.params;
    return store.dispatch('profile/fetchUserInfo', { user: username })
  },

  computed: {
    ...mapState('profile', [
      'username'
    ]),
    ...mapGetters('profile', [
      'avatarLarge'
    ])
  }
};
</script>

<style>

</style>
