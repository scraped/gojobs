<template>
  <div>
    <!-- <bulma-hero
      class="is-medium"
      :background="job.imageUrl"
      :text="job.name">
    </bulma-hero> -->
    <div
      class="hero is-dark"
      :style="`background: linear-gradient(to right${gradient});`">
      <div class="hero-body">
        <div class="container">
          <div class="content">
            <img :src="job.imageUrl">
          </div>
        </div>
      </div>
      <div class="hero" style="background: rgba(0, 0, 0, 0.2);">
        <div class="hero-body">
          <div class="container">
            <div>
            <h1
              class="title is-uppercase is-size-1"
              style="font-family: 'Oswald', sans-serif; font-weight: normal;"
              v-html="job.name">
            </h1>
            <p
              class="is-size-4"
              v-html="job.details.desc">
            </p>
            </div>
            <!-- <div class="tags">
              <span
                class="tag"
                style="opacity: 0.7;">
                {{ job.scTypeName }}
              </span>
              <span
                v-if="job.scModeName"
                class="tag"
                style="opacity: 0.7;">
                {{ job.scModeName }}
              </span>
              <span
                class="tag"
                style="opacity: 0.7;"
                v-for="tag in job.tags"
                :key="tag">
                {{ tag }}
              </span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <div class="box">
              <h2 class="subtitle">Map</h2>
              <div class="tags">
                <span
                  :class="`tag is-${ratingCssClass} is-rounded is-medium`">
                  <span class="icon">
                    <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.likes | formatNumber }}</span></span>
                <span class="tag is-rounded is-medium">
                  <span class="icon">
                    <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.dislikes | formatNumber }}</span></span>
                <span
                  class="tag is-rounded is-medium tooltip"
                  data-tooltip="Launches">
                  <span class="icon">
                    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.playTot | formatNumber }}</span></span>
                <span
                  class="tag is-rounded is-medium tooltip"
                  data-tooltip="People played this">
                  <span class="icon">
                    <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.playUnq | formatNumber }}</span></span>
              </div>

              <div>
                {{ job.platformName }} · {{ job.maxPl }} players
              </div>
            </div>
          </div>

          <div class="column is-one-third-widescreen is-two-fifths-desktop is-12-tablet">
            <div class="box">
              <div class="label">Author</div>
              <div class="media">
                <div class="media-left">
                  <router-link
                    :to="{ name: 'profile', params: { username: job.author }}">
                    <figure class="image image-avatar is-48x48">
                      <img class="is-rounded" :src="avatars.small">
                    </figure>
                  </router-link>
                </div>

                <div class="media-content">
                  <p class="subtitle is-6">
                    <router-link
                      :to="{ name: 'profile', params: { username: job.author }}">
                      @{{ job.author }}
                    </router-link>
                  </p>
                </div>
              </div>

              <br>
              <div class="label">Actual rating</div>
              <!-- <div class="has-text-grey-light is-size-7">
                This rating doesn't consider quits and based only on the actual likes and dislikes.
              </div> -->
              <div>{{ job.stats.rating }}%</div>

              <br>
              <div class="label">RGSC rating</div>
              <div>
                {{ job.stats.ratingQuit }}%
                <span class="has-text-grey">
                  (diff: {{ job.stats.rating - job.stats.ratingQuit }}%)
                </span>
              </div>

              <br>
              <div class="label">Updated</div>
              <div>{{ job.scUpdated | formatDate }} (version {{ job.ver }})</div>

              <template v-if="job.scAdded">
                <br>
                <div class="label">Added</div>
                <div>{{ job.scAdded | formatDate }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { userAvatars } from 'src/helpers';

import BulmaHero from 'src/components/BulmaHero.vue';
import IconGta from 'src/components/IconGta.vue';

export default {
  title() {
    return this.job.name;
  },

  fetchData({ store, route }) {
    const { id } = route.params;
    return store.dispatch('job/fetchJob', { id });
  },

  components: {
    BulmaHero,
    IconGta
  },

  computed: {
    avatars() {
      return userAvatars(this.job.author);
    },

    ...mapState('job', [
      'job'
    ]),

    gradient() {
      const { background } = this.job.details;
      if (background && background.length) {
        return background.reduce((prev, curr) => {
          return prev + `, rgba(${curr})`;
        }, '');
      }
    },

    colorCssClass() {
      const { foregroundLight } = this.job.details;
      // return (foregroundLight === false) ? 'has-text-dark' : 'has-text-white';
      return 'has-text-white';
    },

    ratingCssClass() {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    }
  }
}
</script>
