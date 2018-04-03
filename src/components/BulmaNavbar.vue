<template>
  <nav class="navbar is-dark is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img :src="logo" alt="" title="">
        </router-link>
        <span class="navbar-item is-size-3" style="font-family: 'SignPainter-HouseScript';">
          jobs
        </span>

        <b-dropdown ref="platformDropdown">
          <a class="navbar-item is-unselectable" slot="trigger">
            {{ platformName }}
            <span class="icon">
              <i class="fa fa-angle-down"></i>
            </span>
          </a>

          <b-dropdown-item custom>
            <div class="subtitle is-6">Default platform (if no platform specified, there will be shown jobs only for the selected platform below)</div>
            <b-field>
              <b-radio
                v-model="platform"
                @input="setPlatform"
                size="is-medium"
                native-value="pc">
                <span>PC</span>
              </b-radio>
            </b-field>

            <b-field>
              <b-radio
                v-model="platform"
                @input="setPlatform"
                size="is-medium"
                native-value="ps4">
                <span>PS4</span>
              </b-radio>
            </b-field>

            <b-field>
              <b-radio
                v-model="platform"
                @input="setPlatform"
                size="is-medium"
                native-value="xboxone">
                <span>Xbox One</span>
              </b-radio>
            </b-field>

            <div class="is-clearfix">
            <div class="button is-primary is-outlined is-hidden-desktop is-pulled-right is-clearfix" @click="closePlatformDropdown">Close</div>

            </div>
          </b-dropdown-item>
        </b-dropdown>

        <router-link
          v-if="username"
          class="navbar-item is-hidden-desktop"
          :to="{ name: 'profile', params: { username } }">
            <img :src="avatars.small" style="border-radius: 50%;">
        </router-link>

        <div
          class="navbar-burger"
          @click="toggleMenu"
          :class="{ 'is-active': menuOpened }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuOpened }">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">
          <router-link to="/admin" class="navbar-item">
            <span>Admin panel</span>
          </router-link>
          <router-link to="/crews" class="navbar-item">
            <span>Crews</span>
          </router-link>
          <router-link
            v-if="username"
            class="navbar-item"
            :to="{ name: 'profile', params: { username } }">
            <img :src="avatars.small" style="border-radius: 50%;">
            <span>{{ username }}</span>
          </router-link>
          <router-link
            v-else
            class="navbar-item" :to="{ name: 'auth' }">
            <span>Sign Up or Log In</span>
          </router-link>
          <router-link
            class="navbar-item" :to="{ path: '/azaza' }">
            <span>404 page</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import logo from 'src/images/logo2.png';
import { userAvatars } from 'src/helpers';

export default {
  data() {
    return {
      logo,
      menuOpened: false,
      platform: ''
    };
  },

  computed: {
    platformName() {
      const { platform } = this;
      return {
        pc: 'PC',
        ps4: 'PS4',
        xboxone: 'Xbox One'
      }[platform];
    },

    ...mapState('user', [
      'username'
    ]),

    avatars() {
      return userAvatars(this.username);
    }
  },

  beforeMount() {
    this.platform = this.$cookie.get('platform') || 'pc';
  },

  methods: {
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    },

    setPlatform(platform) {
      this.$cookie.set('platform', platform, { expires: '1Y' });
      this.platform = platform;
      this.$toast.open({
        message: `Platform set to ${this.platformName}`,
        type: 'is-info'
      });
      this.closePlatformDropdown();
      this.$router.push({ path: '/', query: { platform } });
    },

    closePlatformDropdown() {
      this.$refs.platformDropdown.toggle();
    }
  }
};
</script>

<style lang="scss">
@import "src/scss/vars";

.navbar {
  background-color: transparent;
  // background-image: $main-gradient;
}

.navbar-item {
  transition-duration: $speed;
}

.navbar-menu.is-active {
  background: $dark;
}

.navbar-burger {
  color: $white;
}
</style>

