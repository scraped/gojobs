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
                  <icon-gta :icon="scInfo.scTypeIcon" ></icon-gta>
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
                    {{ scInfo.scTypeName }}
                    <template v-if="scInfo.scModeName">
                      — {{ scInfo.scModeName }}
                    </template>
                    ·
                    {{ scInfo.platformName || 'All platforms' }}
                    ·
                    <template v-if="job.minPl">{{ job.minPl }}-</template>{{ job.maxPl }} players
                  </p>
                </div>
              </div>

              <hr>


              <div class="content">
                <p
                  class="is-size-5 is-italic"
                  v-html="job.details.desc">
                </p>

                <p v-if="defaultVehicle">
                  Tested in Creator with <b>{{ defaultVehicle }}</b>.
                </p>

                <template v-if="scInfo.scTypeName === 'Race' || scInfo.scTypeName === 'Parachuting'">
                  <p v-if="!mapShowed">
                    <span
                      class="button is-primary"
                      @click="mapShowed = true">Show map</span>
                  </p>

                  <p v-else>
                    <b-message>
                      The first checkpoint (start/finish line for lap races) is a
                      <span style="color: #00ff00;">green</span>
                      checkpoint, and the last checkpoint (finish for point to point races) is a
                      <span style="color: #ff0000;">red one</span>.
                      <br>
                      Knowing these two checkpoints you can figure out the race direction.
                    </b-message>
                    <race-map
                      :point-to-point="!job.details.specific.race.laps"
                      :locations="job.details.specific.race.chpLocs"
                      :slocations="job.details.specific.race.chpSecLocs">
                    </race-map>
                  </p>
                </template>

                <div class="tags">
                  <span
                    class="tag is-warning"
                    v-if="job.details.specific.teams">
                    <template v-if="job.details.specific.teams > 2">2-</template>{{ job.details.specific.teams }} teams required
                  </span>

                  <template v-if="scInfo.scTypeName === 'Race' || scInfo.scTypeName === 'Parachuting'">
                    <span class="tag">Lap length: {{ job.details.specific.race.dist | mToKm }} km</span>

                    <span class="tag">Number of checkpoints: {{ job.details.specific.race.chp }}</span>

                    <span class="tag">
                      <template v-if="job.details.specific.race.laps">
                        Default number of laps: {{ job.details.specific.race.laps }}
                      </template>
                      <template v-else>
                        Point To Point
                      </template>
                    </span>
                  </template>

                  <template v-if="job.tags && job.tags.length">
                    <router-link
                      to="/"
                      class="tag is-capitalized"
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
                      <span class="icon is-hidden-mobile">
                        <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.likes | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em 0;">
                  <div>
                    <p class="heading">Dislikes</p>
                    <p>
                      <span class="icon is-hidden-mobile">
                        <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.dislikes | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em 0;">
                  <div>
                    <p class="heading">Launches</p>
                    <p>
                      <span class="icon is-hidden-mobile">
                        <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                      </span><span>{{ job.stats.playTot | formatNumber }}</span>
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered has-background-white-ter" style="border-radius: 4px; padding: 1em 0;">
                  <div>
                    <p class="heading">Players</p>
                    <p>
                      <span class="icon is-hidden-mobile">
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
                  class="progress"
                  :class="ratingCssClass(job.stats.ratingQuit)"
                  :value="job.stats.ratingQuit" max="100">
                  {{ job.stats.ratingQuit }}%
                </progress>

                <p><span class="has-text-weight-bold">Actual Rating:</span> {{ job.stats.rating }}%</p>
                <progress
                  class="progress"
                  :class="ratingCssClass(job.stats.rating)"
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
import { mapState } from 'vuex';

import {
  userAvatars,
  rgscRatingCssClass,
  updatedDate,
  scTypeModeIcon,
  scPlatformName
} from '@/helpers';

import IconGta from '@/components/IconGta.vue';
import RaceMap from './RaceMap.vue';
import vehicles from '@/../config/static/vehicles';
import { findIndex } from 'lodash';

export default {
  title() {
    return this.job.name;
  },

  fetchData({ store, route }) {
    const { id } = route.params;
    return store.dispatch('job/fetchJob', { id });
  },

  components: {
    IconGta,
    RaceMap
  },

  data() {
    return {
      mapShowed: false
    };
  },

  methods: {
    ratingCssClass(value) {
      return rgscRatingCssClass(value);
    }
  },

  computed: {
    ...mapState('job', [
      'job'
    ]),

    defaultVehicle() {
      const defVeh = String(this.job.details.specific.race.defVeh);
      return vehicles[defVeh];
    },

    avatars() {
      return userAvatars(this.job.author);
    },

    updatedDate() {
      const { ver } = this.job;
      return updatedDate({ date: this.job.scUpdated, ver });
    },

    scInfo() {
      const { scType, scMode, platform } = this.job;
      // { scTypeName, scTypeIcon, scModeName, platformName }
      return {
        ...scTypeModeIcon({ scType, scMode }),
        ...scPlatformName({ platform })
      };
    },

    gradient() {
      const { background } = this.job.details;
      if (background && background.length) {
        return background.reduce((prev, curr) => {
          return prev + `, rgba(${curr})`;
        }, '');
      }
    }
  }
};
</script>
