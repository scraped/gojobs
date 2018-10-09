<template>
  <div>
    <div
      :style="`background: linear-gradient(to bottom, transparent${gradient(0.3)}, transparent);`"
      class="is-overlay"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <section class="section" :style="`text-align: center; background: radial-gradient(farthest-side at 50%, transparent${gradient(0)}, transparent 90%);`">
              <img
                :src="jobExt.imageUrl"
                width="480"
                height="268"
                style="border-radius: 3px; box-shadow: 15px 15px 35px rgba(0, 0, 0, 0.2)"
              >
            </section>

            <section class="block">
              <div class="content" style="text-align: center;">
                <h1
                  class="title has-text-weight-normal"
                  v-html="job.name"
                />
                <p class="has-text-dark is-size-7">
                   <router-link
                    :to="{name: 'main', query: {type: job.scType}}"
                  >{{jobExt.scTypeName}}</router-link>
                  for
                  {{jobExt.playersNumberText}}
                  <template v-if="isRace">
                    · <a @click="mapShowed = !mapShowed">Show route</a>
                  </template>
                </p>
              </div>
            </section>

            <div class="columns">
              <div class="column is-two-fifths">
                <div class="box" style="height: 100%;">
                  <section class="block">
                    <h3 class="subtitle is-size-6 has-text-grey">Author</h3>

                    <div class="">
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

                          <p class="has-text-grey is-size-7">Crew name</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section class="block">
                    <h3 class="subtitle is-size-6 has-text-grey">Official category & platform</h3>

                    <div class="buttons">
                      <router-link
                        class="button is-small is-rounded"
                        style="border-width: 2px;"
                        :to="{name: 'main', query: {type: job.scType}}"
                      ><icon-gta :icon="jobExt.scTypeIcon" ></icon-gta> <span>{{jobExt.scTypeName}}</span></router-link>
                      <template v-if="jobExt.scModeName">
                        <router-link
                          class="button is-small is-rounded"
                          style="border-width: 2px;"
                          :to="{name: 'main', query: {type: job.scType, mode: job.scMode}}"
                        ><icon-gta :icon="jobExt.scModeIcon" ></icon-gta> <span>{{jobExt.scModeName}}</span></router-link>
                      </template>
                      <router-link
                        class="button is-small is-rounded"
                        style="border-width: 2px;"
                        :to="{name: 'main', query: {platform: job.plat}}"
                      >{{jobExt.platformName}}</router-link>
                    </div>
                  </section>

                  <section
                    v-if="job.tags && job.tags.length"
                    class="block"
                  >
                    <h3 class="subtitle is-size-6 has-text-grey">Feautures</h3>

                    <div class="buttons">
                      <router-link
                        v-for="tag in job.tags"
                        :key="tag"
                        to="/"
                        class="button is-small is-rounded is-capitalized"
                        style="border-width: 2px;"
                      >{{tag}}</router-link>
                    </div>
                  </section>

                  <section class="block">
                    <h3 class="subtitle is-size-6 has-text-grey">RGSC job page</h3>

                    <a
                      class="button is-fullwidth is-primary"
                      :style="`background: rgb(${job.background[0]})`"
                      :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                      target="_blank"
                    >
                      <span>Go to RGSC job page</span>
                      <b-icon icon="external-link" size="is-small"></b-icon>
                    </a>
                  </section>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <div class="box">
                    <section class="block">
                      <h3 class="subtitle is-size-6 has-text-grey has-text-weight-normal">Description</h3>

                      <p
                        class="is-size-5 is-italic"
                        v-html="job.desc"
                      />
                    </section>

                    <section class="block">
                      <h3 class="subtitle is-size-6 has-text-grey has-text-weight-normal">Versions</h3>

                      <div class="content">
                        <p>
                          Updated
                          <span
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                            :data-tooltip="job.scUpdated | formatDate"
                          >{{job.scUpdated | formatDateRelative}} (version {{job.ver}})</span>,
                          added
                          <span
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                            :data-tooltip="job.scAdded | formatDate"
                          >{{job.scAdded | formatDateRelative}}</span>
                        </p>
                        <p>
                          Job info retrieved from RGSC
                          <span
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                            :data-tooltip="job.fetchDate | formatDate"
                          >{{job.fetchDate | formatDateRelative}}</span>
                        </p>
                      </div>
                    </section>
                  </div>
                </div>

                <div style="height: 3rem; border-radius: 3px; position: relative;" :class="`has-background-${ratingCssClass(job.stats.rstRating, false)}`">
                  <div
                    style="position: absolute; top: 3px; bottom: 0; left: 0; border-radius: 3px; background: rgba(0, 0, 0, 0.15);"
                    :style="`right: calc(${100 - job.stats.rating}% + 3px);`"
                  ></div>
                  <div
                    style="position: absolute; top: 6px; bottom: 0; left: 0; border-radius: 3px; background: rgba(0, 0, 0, 0.15);"
                    :style="`right: calc(${100 - job.stats.rstRating}% + 6px);`"
                  ></div>
                  <div
                    class="has-text-white-bis"
                    style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; text-align: center; line-height: 3rem;"
                  >
                    <b-icon
                      pack="fa"
                      icon="thumbs-up"
                      size="is-small"
                      aria-hidden="true"
                    />
                    <span>{{job.stats.rating}}%</span>

                    <span style="opacity: 0.45;">· {{job.stats.rstRating}}%</span>
                  </div>
                </div>
                <p class="is-size-7"><a>Why are there two separate ratings?</a></p>
              </div>
            </div>

            <section class="block">
              <div class="columns is-mobile" style="overflow-x: auto;">
                <div class="column">
                  <article
                    :class="ratingCssClass(job.stats.rstRating)"
                    class="notification"
                  >
                    <p class="is-size-5" style="white-space: nowrap;">
                      <b-icon
                        pack="fa"
                        icon="thumbs-up"
                        size="is-small"
                        aria-hidden="true"
                      />
                      <span>{{job.stats.like | formatNumber}}</span>
                    </p>
                    <p class="is-size-6">Likes</p>
                  </article>
                </div>
                <div class="column">
                  <article class="notification notification_bordered is-light">
                    <p class="is-size-5" style="white-space: nowrap;">
                      <b-icon
                        pack="fa"
                        icon="thumbs-down"
                        size="is-small"
                        aria-hidden="true"
                      />
                      <span>{{job.stats.dislike | formatNumber}}</span>
                    </p>
                    <p class="is-size-6">Dislikes</p>
                  </article>
                </div>
                <div class="column">
                  <article class="notification notification_bordered is-light">
                    <p class="is-size-5" style="white-space: nowrap;">
                      <b-icon
                        pack="fa"
                        icon="gamepad"
                        size="is-small"
                        aria-hidden="true"
                      />
                      <span>{{job.stats.plTot | formatNumber}}</span>
                    </p>
                    <p class="is-size-6">Played</p>
                  </article>
                </div>
                <div class="column">
                  <article class="notification notification_bordered is-light">
                    <p class="is-size-5" style="white-space: nowrap;">
                      <b-icon
                        pack="fa"
                        icon="users"
                        size="is-small"
                        aria-hidden="true"
                      />
                      <span>{{job.stats.plUnq | formatNumber}}</span>
                    </p>
                    <p class="is-size-6">Players</p>
                  </article>
                </div>
                <div class="column">
                  <article class="notification notification_bordered is-light">
                    <p class="is-size-5" style="white-space: nowrap;">
                      <b-icon
                        pack="fa"
                        icon="sign-out"
                        size="is-small"
                        aria-hidden="true"
                      />
                      <span>{{job.stats.quit | formatNumber}}</span>
                    </p>
                    <p class="is-size-6">Quits</p>
                  </article>
                </div>
              </div>
            </section>
          </div>

          <div class="column is-one-third-widescreen is-two-fifths-desktop is-12-tablet">
            <div class="box">
              <h2 class="subtitle">Job Info</h2>
              <template v-if="job.locs && job.locs.length">
                <h3 class="subtitle is-size-6 has-text-grey">Locations</h3>
                <div class="buttons">
                  <span
                    v-for="locShortName in job.locs"
                    :key="locShortName"
                    class="button is-small is-rounded"
                    style="border-width: 2px;"
                  >
                    <b-icon
                      pack="fa"
                      icon="map-marker"
                    />
                    <span>{{locations[locShortName.toLowerCase()]}}</span>
                  </span>
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
                  class="buttons"
                >
                  <span
                    v-for="vehId in job.specific.trfVeh"
                    :key="vehicles[vehId]"
                    class="button is-small is-rounded"
                    style="border-width: 2px;"
                  ><b-icon
                    pack="fa"
                    icon="car"
                    size="is-small"
                    aria-hidden="true"
                  /><span>{{vehicles[vehId]}}</span></span>
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
                <div class="subtitle is-size-6 has-text-grey">Vehicle classes</div>
                <div class="buttons">
                  <span
                    v-for="classShortName in job.specific.classes"
                    :key="classShortName"
                    class="button is-small is-rounded"
                    style="border-width: 2px;"
                  >{{vehClasses[classShortName].name}}</span>
                </div>
              </template>

              <template v-if="job.specific.dist">
                <div class="subtitle is-size-6">
                  <span>Point to point race</span>
                  <span class="has-text-weight-bold is-pulled-right">{{job.specific.laps ? 'No' : 'Yes'}}</span>
                </div>
              </template>

              <template v-if="job.specific.dist">
                <div class="subtitle is-size-6">
                  <span v-if="job.specific.laps">Lap length</span>
                  <span v-else>Route length</span>
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
                  <span class="has-text-weight-bold is-pulled-right">
                    <b-icon
                      pack="fa"
                      icon="car"
                      size="is-small"
                      aria-hidden="true"
                    />
                    <span>{{vehicles[job.specific.defVeh]}}</span>
                  </span>
                </div>
              </template>
            </div>

            <div class="box">
              <h2 class="subtitle">You might also like</h2>

              <p class="is-italic">
                Nothing to show.
              </p>
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
import findIndex from 'lodash/findIndex';

import {
  userAvatars,
  ratingCssClass,
} from '@/helpers';

import {ratingMixin} from '@/mixins';

import IconGta from '@/components/IconGta.vue';
import RaceMap from './RaceMap.vue';
import {vehicles, vehClasses, locations} from '@/../config/static';

export default {
  mixins: [
    ratingMixin,
  ],

  metaInfo() {
    return {
      title: this.job.name,
    };
  },

  fetchData({store, route}) {
    const {id} = route.params;
    return Promise.all([
      store.dispatch('job/fetchJob', {id})
    ]);
  },

  components: {
    IconGta,
    RaceMap,
  },

  data() {
    return {
      mapShowed: false,
      trfVehShowed: false,
      vehicles,
      vehClasses,
      locations,
    };
  },

  mounted() {
    // Array.from(document.getElementsByClassName('navbar')).forEach(el => {
    //   el.style.background = `linear-gradient(to right${this.gradient(0.7)}`;
    // });
  },

  computed: {
    ...mapState('job', [
      'job',
    ]),

    ...mapGetters('job', {
      jobExtGetter: 'jobExt',
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

    isRace() {
      return this.jobExt.scTypeName === 'Race';
    },
  },

  methods: {
    gradient(transparency = 1.0) {
      const {background} = this.job;
      if (background && background.length) {
        return background.reduce(
          (prev, curr) => `${prev}, rgba(${curr}, ${transparency})`,
          '',
        );
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';

.notification {
  height: 100%;
}

.notification_bordered {
  border: 2px dashed $grey-light;
}

.media-wrapper {
  display: inline-block;
  margin: 0 0 1em;
  padding: 0.5em 2em 0.5em 1em;
  background: $white-ter;
  border-radius: 30px;
  border: 1px solid $grey-lighter;
  box-shadow: 1px 1px 10px $grey-lighter;
}

.title__special {
  font-family: 'Oswald', sans-serif;
}

.tag__info {
  border: 1px solid $primary;
}
</style>
