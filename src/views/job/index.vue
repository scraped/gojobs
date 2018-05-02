<template>
  <div>
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
    </div>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <div class="box" style="position: relative;">
              <div class="has-text-grey-lighter" style="position: absolute; top: 0.5em; right: 0.5em; font-size: 7em; line-height: 0;">
                <span>
                  <icon-gta :icon="job.scTypeIcon" ></icon-gta>
                </span>
              </div>
              <h1
                class="title is-uppercase is-size-1"
                style="font-family: 'Oswald', sans-serif; font-weight: normal;"
                v-html="job.name">
                {{ job.name }}
              </h1>

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
                  <p>
                    <router-link
                      v-if="job.author"
                      :to="{ name: 'profile', params: { username: job.author }}">
                      @{{ job.author }}
                    </router-link>
                    <span
                      v-if="!job.author && job.rockstar"
                      class="tag is-white is-uppercase"
                      style="border: 1px solid #01498E; color: #01498E;">
                      <span class="icon is-small">
                        <i class="fa fa-check"></i>
                      </span>
                      <span>Rockstar Job</span>
                    </span>
                    <span
                      v-if="job.author && job.rockstar"
                      class="tag is-white is-uppercase" style="border: 1px solid #FCAF17; color: #01498E;">
                      <span class="icon is-small">
                        <i class="fa fa-check"></i>
                      </span>
                      <span>Rockstar Verified Job</span>
                    </span>
                  </p>
                  <p class="has-text-grey">
                    {{ job.scTypeName }}
                    <template v-if="job.scModeName">
                      — {{ job.scModeName }}
                    </template>
                    ·
                    {{ job.platformName || 'All platforms' }}
                    ·
                    {{ job.maxPl }} players
                  </p>
                </div>
              </div>

              <hr>


              <div class="content">
                <p
                  class="is-size-5 is-italic"
                  v-html="job.details.desc">
                </p>

                <div class="tags">
                  <template v-if="job.details.specific.race">
                    <span class="tag">Lap length: {{ job.details.specific.race.dist | mToKm }} km</span>

                    <span class="tag">Number of checkpoints: {{ job.details.specific.race.chp }}</span>
                  </template>

                  <template v-if="job.tags && job.tags.length">
                    <router-link
                      to="/"
                      class="tag is-link is-capitalized"
                      v-for="tag in job.tags"
                      :key="tag">
                      {{ tag }}</router-link>
                  </template>
                </div>
              </div>

              <nav class="level is-mobile">
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em 0;">
                  <div>
                    <p class="heading">Likes</p>
                    <p class="is-size-6">
                      <span class="icon">
                        <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.likes | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em;">
                  <div>
                    <p class="heading">Dislikes</p>
                    <p>
                      <span class="icon">
                        <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.dislikes | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em;">
                  <div>
                    <p class="heading">Launches</p>
                    <p>
                      <span class="icon">
                        <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.playTot | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em;">
                  <div>
                    <p class="heading">Players</p>
                    <p>
                      <span class="icon">
                        <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.playUnq | formatNumber }}</span>
                    </p>
                  </div>
                </div>
              </nav>

              <p class="has-text-grey-light">
                <template v-if="job.ver > 1">
                  Updated {{ job.scUpdated | formatDate }}
                  (version {{ job.ver }})
                </template>
                <template v-if="job.scAdded">
                  <template v-if="job.ver > 1">
                    ·
                  </template>
                  Added {{ job.scAdded | formatDate }}
                </template>
              </p>
            </div>
          </div>

          <div class="column is-one-third-widescreen is-two-fifths-desktop is-12-tablet">
            <div class="box">
              <h2 class="subtitle">Ratings</h2>
              <div class="content">
                <p><span class="has-text-weight-bold">RGSC Rating:</span> {{ job.stats.ratingQuit }}%</p>
                <progress
                  :class="`progress is-${ratingCssClass(job.stats.ratingQuit)}`"
                  :value="job.stats.ratingQuit" max="100">
                  {{ job.stats.ratingQuit }}%
                </progress>

                <p><span class="has-text-weight-bold">Actual Rating:</span> {{ job.stats.rating }}%</p>
                <progress
                  :class="`progress is-${ratingCssClass(job.stats.rating)}`"
                  :value="job.stats.rating" max="100">
                  {{ job.stats.rating }}%
                </progress>

                <p class="is-size-7">
                  <router-link to="/">What is the difference?</router-link>
                </p>
              </div>

              <a
                :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                target="_blank"
                class="is-block button is-link is-outlined is-medium">
                Go to RGSC Job Page
              </a>
            </div>

            <div class="box">
              <h2 class="subtitle">You might also like</h2>
              <b-message>
                Currently unavailable.
              </b-message>
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
    IconGta
  },

  methods: {
    ratingCssClass(rating) {
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    }
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
    }
  }
}
</script>
