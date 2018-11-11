<template>
  <div>
    <div
      :style="`background: linear-gradient(45deg, transparent${gradient(0)}, transparent);`"
      class="is-overlay"
    />
    <section class="section">
      <div class="container">
        <h1 class="title">Job</h1>
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
                <h1 class="title has-text-weight-normal">
                  <span v-html="job.name" style="padding-right: 10px;"/><span
                    v-if="jobExt.recentlyAdded"
                    class="tooltip"
                    data-tooltip="Added less than 2 weeks ago"
                  >🔥</span><span
                    v-if="job.rockstar"
                    class="tag is-primary is-medium is-rounded"
                    style="font-family: 'Lato', sans-serif; opacity: 0.8;"
                  ><b-icon
                    icon="check"
                    size="is-small"
                  /><span v-if="job.author">Rockstar Verified Job</span><span v-else>Rockstar Job</span>
                  </span>
                </h1>
                <p class="has-text-dark is-size-7">
                  <template v-if="!job.rockstar">
                    <router-link :to="{name: 'main', query: {platform: job.plat}}">
                      {{jobExt.platformName}}
                    </router-link>
                    ·
                  </template>
                  <template v-if="isRace">
                    {{job.specific.laps ? 'Lap': 'Point to point'}}
                  </template>
                  <router-link
                    :to="{name: 'main', query: {type: job.scType}}"
                  >{{jobExt.scTypeName}}</router-link>
                  for {{jobExt.playersNumberText}}
                  <template v-if="job.teams">
                    & {{job.teams === 2 ? '2' : `2-${job.teams}`}} teams
                  </template>
                  <template v-if="isRace">
                    ·
                    <a
                      href=""
                      @click.prevent="mapShowed = !mapShowed"
                    >Show route</a>
                    <template v-if="job.specific.dist">
                      ({{job.specific.dist | mToKm}} km)
                    </template>
                  </template>
                </p>
              </div>
            </section>

            <div class="columns">
              <div class="column is-two-fifths">
                <div class="box">
                  <section
                    class="block"
                  >
                    <h3 class="title is-size-5 has-text-grey">Author</h3>

                    <div class="">
                      <div class="media">
                        <div class="media-left">
                          <router-link
                            v-if="job.author"
                            :to="{name: 'profile', params: {username: job.author}}"
                          >
                            <img
                              :src="avatars.small"
                              :style="job.crew ? imageOutlined(job.crew.color, 2) : ''"
                              class="rounded"
                              width="48"
                              height="48"
                            >
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
                              v-else
                              class="tag is-primary is-medium is-rounded"
                              style="font-family: 'Lato', sans-serif; opacity: 0.8;"
                            ><b-icon
                              icon="check"
                              size="is-small"
                            /><span>Rockstar</span></span>
                          </div>

                          <p
                            v-if="job.crew"
                            class="has-text-grey is-size-7"
                          >{{job.crew.name}}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    v-if="jobExt.scModeName"
                    class="block"
                  >
                    <h3 class="title is-size-5 has-text-grey">Official category</h3>
                    <div class="buttons">
                      <router-link
                        :to="{name: 'main', query: {type: job.scType, mode: job.scMode}}"
                        class="button button_responsible is-light is-rounded"
                      ><icon-gta :icon="jobExt.scModeIcon"/><span>{{jobExt.scModeName}}</span></router-link>
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
                        class="button button_responsible is-rounded is-capitalized"
                      >{{tag}}</router-link>
                    </div>
                  </section>

                  <section class="block">
                    <hr>
                    <a
                      :href="`https://socialclub.rockstargames.com/games/gtav/jobs/job/${job.jobCurrId}`"
                      class="button button_shadow button_responsible is-fullwidth is-primary"
                      target="_blank"
                    >
                      <span>Go to RGSC job page</span>
                      <b-icon
                        icon="external-link"
                        size="is-small"
                      />
                    </a>
                  </section>
                </div>
              </div>

              <div class="column">
                <div class="">
                  <div class="box">
                    <h3 class="title is-size-5 has-text-grey">Description</h3>
                    <section class="block">
                      <p
                        class="is-size-5 is-italic"
                        v-html="job.desc"
                      />
                    </section>

                    <section class="block">
                      <hr>

                      <div class="content has-text-grey">
                        <p>
                          Updated
                          <span
                            :data-tooltip="job.scUpdated | formatDate"
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                          >{{job.scUpdated | formatDateRelative}}</span> (version {{job.ver}}),
                          added
                          <span
                            :data-tooltip="job.scAdded | formatDate"
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                          >{{job.scAdded | formatDateRelative}}</span>
                        </p>
                        <p>
                          Job info retrieved from RGSC
                          <span
                            :data-tooltip="job.fetchDate | formatDate"
                            class="tooltip"
                            style="border-bottom: 1px dashed currentColor;"
                          >{{job.fetchDate | formatDateRelative}}</span>
                        </p>
                      </div>
                    </section>
                  </div>
                </div>

                <div style="height: 4rem; border-radius: 3px; position: relative;" :class="`has-background-${ratingCssClass(job.stats.rstRating, false)}`" class="is-size-5">
                  <div
                    style="position: absolute; top: 7%; bottom: 0; left: 0; border-radius: 3px; background: rgba(0, 0, 0, 0.15);"
                    :style="`right: calc(${100 - job.stats.rating}% + 3px);`"
                  ></div>
                  <div
                    style="position: absolute; top: 14%; bottom: 0; left: 0; border-radius: 3px; background: rgba(0, 0, 0, 0.15);"
                    :style="`right: calc(${100 - job.stats.rstRating}% + 6px);`"
                  ></div>
                  <div
                    class="has-text-white-bis"
                    style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; text-align: center; line-height: 4rem;"
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
              <template v-if="job.locs && job.locs.length">
                <h3 class="title is-size-5 has-text-grey">Locations</h3>
                <div class="tags">
                  <span
                    v-for="(locShortName, i) in job.locs"
                    v-if="i < 3 || allLocationsShowing"
                    :key="locShortName"
                    class="tag is-small is-rounded"
                  >
                    <b-icon
                      pack="fa"
                      icon="map-marker"
                    />
                    <span>{{locations[locShortName.toLowerCase()]}}</span>
                  </span>

                  <span
                    v-if="showMoreLocationsButton"
                    class="tag is-rounded"
                    @click="allLocationsShowing = true"
                  >Show all</span>
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
                <div class="title is-size-5 has-text-grey">Available classes</div>
                <div class="tags">
                  <span
                    v-for="classShortName in job.specific.classes"
                    :key="classShortName"
                    class="tag is-small is-rounded"
                  >{{vehClasses[classShortName].name}}</span>
                </div>
              </template>

              <template v-if="job.specific.defVeh">
                <h3 class="title is-size-5 has-text-grey">
                  Default vehicle
                </h3>
                <div class="tags">
                  <div class="tag is-small is-rounded">{{vehicles[job.specific.defVeh]}}</div>
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
              v-if="isRace"
              :active.sync="mapShowed"
              scroll="keep"
            >
              <section class="section has-background-white">
                <h2 class="subtitle">{{job.name}} - Race Map</h2>
                <div class="content">
                  The first checkpoint (start/finish line for lap races) is a green checkpoint, and the last checkpoint (finish for point to point races) is a red one. Knowing these two checkpoints you can figure out the race direction.
                </div>
                <race-map
                  :point-to-point="job.specific.p2p"
                  :locations="job.specific.chpLocs"
                  :slocations="job.specific.chpSecLocs"
                />
              </section>
            </b-modal>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {AllHtmlEntities} from 'html-entities';

import {mapState, mapGetters} from 'vuex';
import {userAvatars} from '@/helpers';
import {ratingMixin, imageOutlined} from '@/mixins';

import IconGta from '@/components/IconGta.vue';
import RaceMap from './RaceMap.vue';

import {vehicles, vehClasses, locations} from '@/../config/static';

export default {
  metaInfo() {
    return {
      title: new AllHtmlEntities().decode(this.job.name),
    };
  },

  fetchData({store, route}) {
    const {id} = route.params;
    return Promise.all([
      store.dispatch('job/fetchJob', {id}),
    ]);
  },

  components: {
    IconGta,
    RaceMap,
  },

  mixins: [
    ratingMixin,
    imageOutlined,
  ],

  data() {
    return {
      mapShowed: false,
      trfVehShowed: false,
      vehicles,
      vehClasses,
      locations,

      allLocationsShowing: false,
    };
  },

  computed: {
    ...mapState('job', [
      'job',
    ]),

    ...mapGetters('job', {
      jobExtGetter: 'jobExt',
    }),

    showMoreLocationsButton() {
      return this.job.locs
        && this.job.locs.length > 3
        && !this.allLocationsShowing;
    },

    jobExt() {
      return this.jobExtGetter(this.job);
    },

    defaultVehicle() {
      const defVeh = String(this.job.specific.defVeh);
      return vehicles[defVeh];
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
@import "@/scss/vars.scss";

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

.title {
  font-family: "Rubik", sans-serif;
}

.title__special {
  font-family: "Oswald", sans-serif;
}

.tag__info {
  border: 1px solid $primary;
}
</style>
