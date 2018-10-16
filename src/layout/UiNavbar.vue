<template>
  <nav class="navbar is-dark">
    <div class="container">
      <div class="navbar-brand">
        <router-link
          to="/"
          exact-active-class=""
          class="navbar-item"
        >
          <img
            src="@/images/gtaonline-logo-mini.png"
            alt="Go to the main page"
            title="Go to the main page"
          >
          <span class="navbar__icon-addition is-size-3 is-unselectable">jobs</span>
        </router-link>

        <router-link
          v-if="username"
          class="navbar-item is-hidden-desktop"
          :to="{name: 'profile', params: {username}}"
        >
          <img :src="avatars.small" style="border-radius: 50%;">
        </router-link>

        <div
          class="navbar-burger"
          @click="toggleMenu"
          :class="{'is-active': menuOpened}"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        :class="{'is-active': menuOpened}"
        class="navbar-menu"
      >
        <div class="navbar-start"/>

        <div class="navbar-end">
          <router-link
            to="/crews"
            class="navbar-item"
          >
            <span>Crews</span>
          </router-link>

          <router-link
            v-if="username"
            :to="{ name: 'profile', params: { username } }"
            class="navbar-item"
          >
            <img :src="avatars.small" style="border-radius: 50%;">
            <span>{{username}}</span>
          </router-link>

          <template v-else>
            <router-link
              :to="{name: 'auth'}"
              class="navbar-item"
            >
              <span>Sign Up</span>
            </router-link>

            <a
              class="navbar-item"
              @click="isLogInModal = true"
            >
              Log In
            </a>
          </template>
        </div>
      </div>
    </div>

    <b-modal
      :active.sync="isLogInModal"
      scroll="keep"
      has-modal-card
    >
      <log-in/>
    </b-modal>
  </nav>
</template>

<script>
import {platforms} from '@/../config/static'
import {mapState} from 'vuex';
import {userAvatars} from '@/helpers';

import LogIn from '@/components/LogIn.vue';

export default {
  components: {
    LogIn,
  },

  data() {
    return {
      menuOpened: false,
      isLogInModal: false,
    };
  },

  computed: {
    ...mapState('user', [
      'username'
    ]),

    avatars() {
      return userAvatars(this.username);
    }
  },

  methods: {
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/vars.scss";

.navbar-item {
  transition-duration: $speed;
}

.navbar-burger {
  color: $white;
}

.navbar__icon-addition {
  padding-left: 0.6em;
  font-family: "SignPainter-HouseScript", sans-serif;
}
</style>

