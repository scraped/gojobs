<template>
  <div>
    <div class="is-overlay" :style="`background: linear-gradient(to bottom, transparent${gradient}, transparent);`"></div>
    <section class="section">
      <div class="container">
        <h1 class="title" v-html="job.name">Job</h1>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <img :src="jobExt.imageUrl" width="480" height="268">
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <div class="box" style="position: relative;">
              <div class="has-text-grey-lighter" style="position: absolute; top: 0.5em; right: 0.5em; font-size: 7em; line-height: 0;">
                <span>
                  <icon-gta :icon="jobExt.scTypeIcon" ></icon-gta>
                </span>
              </div>

               <h2 class="subtitle">Information</h2>

              <div class="media">
                <div class="media-left">
                  <router-link
                    :to="{ name: 'profile', params: { username: job.author }}">
                    <figure class="image image-avatar is-48x48">
                      <img
                        v-if="job.author"
                        class="is-rounded"
                        :src="avatars.small">
                      <img
                        v-else
                        class="is-rounded" src="@/images/rockstar-avatar-48.png">
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
                      v-if="job.rockstar"
                      class="tag is-warning"
                    >
                      <span class="icon is-small">
                        <i class="fa fa-check"></i>
                      </span>
                      <span v-if="job.author">
                        Rockstar Verified Job
                      </span>
                      <span v-else>
                        Official Rockstar Job
                      </span>
                    </span>
                  </p>
                  <p class="has-text-grey">
                    {{ jobExt.scTypeName }}
                    <template v-if="jobExt.scModeName">
                      — {{ jobExt.scModeName }}
                    </template>
                    ·
                    {{ jobExt.platformName || 'All platforms' }}
                    <template v-if="jobExt.playersNumberText">
                      · {{jobExt.playersNumberText}}
                    </template>
                  </p>
                </div>
              </div>
              <br>

              <div class="content">
                <p
                  class="is-size-5 is-italic"
                  v-html="job.desc">
                </p>

                <p v-if="defaultVehicle">
                  Tested in Creator with
                  {{ defaultVehicle }}
                </p>

                <!-- <div v-if="job.details.specific.race.trfVeh.length" class="tags">
                  Transformations:
                  {{ transformVehicles }}
                </div> -->

                <div
                  v-if="job.tags && job.tags.length"
                  class="tags"
                >
                  <router-link
                    v-if="job.tags"
                    to="/"
                    v-for="(tag, i) in job.tags"
                    :key="tag"
                    class="tag is-capitalized">{{ tag }}</router-link>

                  <!-- <span
                    v-if="job.details.specific.teams"
                    class="tag"
                  >
                    <template v-if="job.details.specific.teams > 2">2-</template>{{ job.details.specific.teams }} teams
                  </span> -->
                </div>

                <div v-if="jobExt.scTypeName === 'Race' || jobExt.scTypeName === 'Parachuting'">
                  <p v-if="mapShowed">
                    <!-- <b-notification type="is-info" :closable="false">
                      The first checkpoint (start/finish line for lap races) is a green checkpoint, and the last checkpoint (finish for point to point races) is a red one. Knowing these two checkpoints you can figure out the race direction.
                    </b-notification> -->
                    <!-- <race-map
                      :point-to-point="job.details.specific.race.p2p"
                      :locations="job.details.specific.race.chpLocs"
                      :slocations="job.details.specific.race.chpSecLocs">
                    </race-map> -->
                  </p>
                </div>
              </div>

              <div class="tags">
                <span class="tag is-rounded is-large">
                  <span class="icon">
                    <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.like | formatNumber }}</span>
                </span>

                <span class="tag is-rounded is-large has-text-grey-light">
                  <span class="icon" >
                    <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.dislike | formatNumber }}</span>
                </span>

                <span class="tag is-rounded is-large">
                  <span class="icon is-hidden-mobile">
                    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                  </span><span>{{ job.stats.plTot | formatNumber }}</span>
                </span>

                <span class="tag is-rounded is-large">
                  <span class="icon is-hidden-mobile">
                      <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                    </span><span>{{ job.stats.plUnq | formatNumber }}</span>
                </span>

                <span class="tag is-rounded is-large has-text-danger">
                  <span class="icon is-hidden-mobile">
                      <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i>
                    </span><span>{{ job.stats.quit | formatNumber }}</span>
                </span>
              </div>

              <div class="content">
                <p>
                  <b>Actual rating:</b>
                  <span :class="`has-text-${ratingCssClass(job.stats.rating, false)}`">{{ job.stats.rating }}%</span>
                </p>
                <p>
                  <b>RGSC rating (quits during the job considered dislikes):</b>
                  <span :class="`has-text-${ratingCssClass(job.stats.rstRating, false)}`">{{ job.stats.rstRating }}%</span>
                </p>
              </div>



              <p class="has-text-grey-light">
                Information updated {{ job.fetchDate | formatDate }}
                <template v-if="job.ver > 1">
                  · Updated {{ job.scUpdated | formatDate }}
                  (version {{ job.ver }})
                </template>
                <template v-if="job.scAdded">
                  · Added {{ job.scAdded | formatDate }}
                </template>
              </p>
            </div>

            <div class="box">
              <h2 class="subtitle">You might also like</h2>

              <p class="is-italic">
                Nothing to show.
              </p>
            </div>

            <div class="box">
              <h2 class="subtitle">
                Reviews
              </h2>
              <hr>

              <div class="buttons">
                <a class="button is-primary">
                  Review the job
                </a>
                <a class="button is-light">
                  Suggest a screenshot
                </a>
                <a class="button is-light">
                  Suggest a video
                </a>
              </div>
              <p class="is-italic">
                No reviews to show.
              </p>
            </div>
          </div>

          <div class="column is-one-third-widescreen is-two-fifths-desktop is-12-tablet">

            <div class="box is-paddingless">
              <div class="section">
                Lap length
                <!-- <span class="is-pulled-right has-text-weight-bold">{{ job.details.specific.race.dist | mToKm }} km</span> -->
              </div>
              <div class="section">
                Number of checkpoints
                <!-- <span class="is-pulled-right has-text-weight-bold">{{ job.details.specific.race.chp }}</span> -->
              </div>
              <!-- <div
                v-if="job.details.specific.race.laps"
                class="section"
              >
                Default number of laps
                <span class="is-pulled-right has-text-weight-bold">
                  <template v-if="job.details.specific.race.p2p">
                    Point to point
                  </template>
                  <template v-else>
                    {{ job.details.specific.race.laps }}
                  </template>
                </span>
              </div> -->
              <a
                class="button is-block is-medium is-primary is-radiusless"
                :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                target="_blank">
                <span>Go to RGSC Job Page</span>
                <b-icon pack="fa" icon="angle-right" size="is-small"></b-icon>
              </a>
              <a
                class="button is-block is-medium is-text is-radiusless"
                @click="mapShowed = !mapShowed">
                <template v-if="mapShowed">Hide Route</template>
                <template v-else> Show Route</template>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

import {
  userAvatars,
  ratingCssClass,
  updatedDate,
  scTypeModeIcon,
  scPlatformName
} from '@/helpers';

import {ratingMixin} from '@/mixins';

import IconGta from '@/components/IconGta.vue';
import RaceMap from './RaceMap.vue';
import vehicles from '@/../config/static/vehicles';
import findIndex from 'lodash/findIndex';

export default {
  mixins: [
    ratingMixin
  ],

  metaInfo() {
    return {
      title: this.job.name
    }
  },

  fetchData({ store, route }) {
    const { id } = route.params;
    return Promise.all([
      store.dispatch('job/fetchJob', { id })
    ]);
  },

  components: {
    IconGta,
    RaceMap
  },

  data() {
    return {
      mapShowed: false,
      transformations: false,
      vehicles
    };
  },

  computed: {
    ...mapState('job', [
      'job'
    ]),

    ...mapGetters('job', {
      jobExtGetter: 'jobExt'
    }),

    jobExt() {
      return this.jobExtGetter(this.job);
    },

    defaultVehicle() {
      const defVeh = String(this.job.specific.defVeh);
      return vehicles[defVeh];
    },

    transformVehicles() {
      return '';

      const { trfVeh } = this.job.details.specific.race;

      let vehiclesString = '';

      if (trfVeh && trfVeh.length) {
        vehiclesString += vehicles[trfVeh[0]];
        for (let i = 1; i < trfVeh.length; i++) {
          vehiclesString += `, ${vehicles[trfVeh[i]]}`;
        }
      }

      return vehiclesString;
    },

    avatars() {
      return userAvatars(this.job.author);
    },

    updatedDate() {
      const { ver } = this.job;
      return updatedDate({ date: this.job.scUpdated, ver });
    },

    gradient() {
      const {background} = this.job;
      if (background && background.length) {
        return background.reduce((prev, curr) => {
          return prev + `, rgba(${curr}, 0.3)`;
        }, '');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/vars.scss";

.title__special {
  font-family: 'Oswald', sans-serif;
}

.tag__info {
  border: 1px solid $primary;
}
</style>

