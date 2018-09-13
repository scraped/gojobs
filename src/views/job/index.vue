<template>
  <div>
    <div class="is-overlay" :style="`background: linear-gradient(to bottom, transparent${gradient(0.3)}, transparent);`"></div>
    <section class="section">
      <div class="container">
        <h1
          v-html="job.name"
          class="title"
        >Job</h1>
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

              <div class="media">
                <div class="media-left">
                  <router-link
                    :to="{name: 'profile', params: {username: job.author}}">
                    <figure class="image image-avatar is-48x48">
                      <img
                        v-if="job.author"
                        class="is-rounded"
                        :src="avatars.small"
                      >
                      <img
                        v-else
                        class="is-rounded" src="@/images/rockstar-avatar-48.png"
                      >
                    </figure>
                  </router-link>
                </div>

                <div class="media-content">
                  <div class="title is-size-5 is-marginless">
                    <router-link
                      v-if="job.author"
                      :to="{name: 'profile', params: {username: job.author}}">
                      @{{job.author}}
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
                  </div>
                  <p class="has-text-grey">
                    <router-link
                      :to="{name: 'main', query: {type: job.scType}}"
                    >{{jobExt.scTypeName}}</router-link>
                    <template v-if="jobExt.scModeName">
                      —
                      <router-link
                        :to="{name: 'main', query: {type: job.scType, mode: job.scMode}}"
                      >{{jobExt.scModeName}}</router-link>
                    </template>
                    ·
                    <router-link
                      v-if="job.plat"
                      :to="{name: 'main', query: {platform: job.plat}}"
                    >{{jobExt.platformName}}</router-link>
                    <span v-else>All platforms</span>
                  </p>
                </div>
              </div>
              <br>

              <div class="content">
                <p
                  class="is-size-5 is-italic"
                  v-html="job.desc">
                </p>

                <!-- <div v-if="job.details.specific.race.trfVeh.length" class="tags">
                  Transformations:
                  {{transformVehicles}}
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
                    class="tag is-capitalized">{{tag}}</router-link>

                  <!-- <span
                    v-if="job.details.specific.teams"
                    class="tag"
                  >
                    <template v-if="job.details.specific.teams > 2">2-</template>{{job.details.specific.teams}} teams
                  </span> -->
                </div>
              </div>

              <div class="tags">
                <span class="tag is-rounded is-large">
                  <span class="icon">
                    <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{job.stats.like | formatNumber}}</span>
                </span>

                <span class="tag is-rounded is-large has-text-grey-light">
                  <span class="icon" >
                    <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{job.stats.dislike | formatNumber}}</span>
                </span>

                <span class="tag is-rounded is-large">
                  <span class="icon is-hidden-mobile">
                    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                  </span><span>{{job.stats.plTot | formatNumber}}</span>
                </span>

                <span class="tag is-rounded is-large">
                  <span class="icon is-hidden-mobile">
                      <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                    </span><span>{{job.stats.plUnq | formatNumber}}</span>
                </span>

                <span class="tag is-rounded is-large has-text-danger">
                  <span class="icon is-hidden-mobile">
                      <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i>
                    </span><span>{{job.stats.quit | formatNumber}}</span>
                </span>
              </div>

              <div class="content">
                <p>
                  <b>Actual rating:</b>
                  <span :class="`has-text-${ratingCssClass(job.stats.rating, false)}`">{{job.stats.rating}}%</span>
                </p>
                <p>
                  <b>RGSC rating (quits during the job considered dislikes):</b>
                  <span :class="`has-text-${ratingCssClass(job.stats.rstRating, false)}`">{{job.stats.rstRating}}%</span>
                </p>
              </div>



              <p class="has-text-grey-light">
                Information updated {{job.fetchDate | formatDate}}
                <template v-if="job.ver > 1">
                  · Updated {{job.scUpdated | formatDate}}
                  (version {{job.ver}})
                </template>
                <template v-if="job.scAdded">
                  · Added {{job.scAdded | formatDate}}
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
            <div class="box">
              <h2 class="subtitle">Job Info</h2>
              <template v-if="job.locs && job.locs.length">
                <div class="subtitle is-size-6">Locations</div>
                <div class="tags">
                  <span
                    v-for="locShortName in job.locs"
                    :key="locShortName"
                    class="tag is-white is-radiusless is-paddingless"
                    :style="`border-bottom: 3px solid rgb(${job.background[0]})`"
                  >{{locations[locShortName.toLowerCase()]}}</span>
                </div>
              </template>

              <template v-if="job.teams">
                <div class="subtitle is-size-6">
                  <span>Required number of teams</span>
                  <span class="has-text-weight-bold is-pulled-right">{{job.teams === 2 ? '2' : `2-${job.teams}`}}</span>
                </div>
              </template>

              <template v-if="job.specific.trfVeh && job.specific.trfVeh.length">
                <div class="subtitle is-size-6">Vehicles in Transfrom race</div>
                <div
                  v-if="trfVehShowed"
                  class="tags"
                >
                  <span
                    v-for="vehId in job.specific.trfVeh"
                    :key="vehicles[vehId]"
                    class="tag is-white is-radiusless is-paddingless"
                    :style="`border-bottom: 3px solid rgb(${job.background[0]})`"
                  >{{vehicles[vehId]}}</span>
                </div>
                <div
                  v-else
                  class="content"
                >
                  <a
                    class="is-size-7"
                    @click="trfVehShowed = true"
                  >This is sometimes a spoiler, so to reveal the list click here.</a>
                </div>
              </template>

              <template v-if="job.specific.classes && job.specific.classes.length">
                <div class="subtitle is-size-6">Vehicle classes</div>
                <div class="tags">
                  <span
                    v-for="classShortName in job.specific.classes"
                    :key="classShortName"
                    class="tag is-white is-radiusless is-paddingless"
                    :style="`border-bottom: 3px solid rgb(${job.background[0]})`"
                  >{{vehClasses[classShortName].name}}</span>
                </div>
              </template>

              <template v-if="jobExt.playersNumberText">
                <div class="subtitle is-size-6">
                  <span>Number of players</span>
                  <span class="has-text-weight-bold is-pulled-right">{{jobExt.playersNumberText}}</span>
                </div>
              </template>

              <template v-if="job.specific.dist">
                <div class="subtitle is-size-6">
                  <span>Lap length</span>
                  <span class="has-text-weight-bold is-pulled-right">{{job.specific.dist | mToKm}} km</span>
                </div>
              </template>

              <template v-if="job.specific.laps">
                <div class="subtitle is-size-6">
                  <span>Default number of laps</span>
                  <span class="has-text-weight-bold is-pulled-right">{{job.specific.laps}}</span>
                </div>
              </template>

              <template v-if="job.specific.defVeh">
                <div class="subtitle is-size-6">
                  <span>Tested with</span>
                  <span class="has-text-weight-bold is-pulled-right">{{vehicles[job.specific.defVeh]}}</span>
                </div>
              </template>

              <div class="buttons">
                <div
                  v-if="isRace"
                  class="button is-fullwidth is-medium"
                  @click="mapShowed = !mapShowed"
                >
                  Show race route
                </div>

                <a
                  class="button is-fullwidth is-medium is-primary"
                  :style="`background: rgb(${job.background[0]})`"
                  :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                  target="_blank"
                >
                  <span>Go to RGSC job page</span>
                  <b-icon icon="external-link" size="is-small"></b-icon>
                </a>
              </div>
              <!-- <a
                class="button is-block is-medium is-primary is-radiusless"
                :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                target="_blank">
                <span>Go to RGSC Job Page</span>
                <b-icon pack="fa" icon="angle-right" size="is-small"></b-icon>
              </a> -->
            </div>

            <b-modal
              v-if='isRace'
              :active.sync="mapShowed"
              scroll="keep"
            >
              <section class="section has-background-white">
                <h2 class="title has-text-weight-normal">{{job.name}} - Race Map</h2>
                <div class="content">
                  The first checkpoint (start/finish line for lap races) is a green checkpoint, and the last checkpoint (finish for point to point races) is a red one. Knowing these two checkpoints you can figure out the race direction.
                </div>
                <race-map
                  :point-to-point="job.specific.p2p"
                  :locations="job.specific.chpLocs"
                  :slocations="job.specific.chpSecLocs">
                </race-map>
              </section>
            </b-modal>
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
} from '@/helpers';

import {ratingMixin} from '@/mixins';

import IconGta from '@/components/IconGta.vue';
import RaceMap from './RaceMap.vue';
import {vehicles, vehClasses, locations} from '@/../config/static';
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

  fetchData({store, route}) {
    const {id} = route.params;
    return Promise.all([
      store.dispatch('job/fetchJob', {id})
    ]);
  },

  components: {
    IconGta,
    RaceMap
  },

  data() {
    return {
      mapShowed: false,
      trfVehShowed: false,
      vehicles,
      vehClasses,
      locations
    };
  },

  mounted() {
    const {background} = this.job;
    Array.from(document.getElementsByClassName('navbar')).forEach(el => {
      console.log('here');
      el.style.background = `linear-gradient(to right${this.gradient(0.7)}`;
      // `rgb(${background[2]})`;
    });
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

      const {trfVeh} = this.job.details.specific.race;

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
      const {ver} = this.job;
      return updatedDate({date: this.job.scUpdated, ver});
    },

    isRace() {
      return this.jobExt.scTypeName === 'Race';
    }
  },

  methods: {
    gradient(transparency = 1.0) {
      const {background} = this.job;
      if (background && background.length) {
        console.log(transparency);
        return background.reduce((prev, curr) => {
          return prev + `, rgba(${curr}, transparency)`;
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

