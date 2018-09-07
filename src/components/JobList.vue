<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-one-third-widescreen is-two-fifths-desktop is-two-fifths-tablet">
        <div class="filters" ref="filters">
          <div class="filters__main box is-shadowless">
            <h2 class="is-size-4 is-size-5-touch">
              <b-dropdown
                v-model="sortModel"
                position="is-bottom-left"
                @change="sortChanged"
              >
                <span
                  slot="trigger"
                  class="dropdown__trigger is-unselectable"
                >
                  {{sortTypes[sortModel]}}
                  <span class="has-text-primary">
                    {{count | formatNumber}} jobs
                  </span>
                  <b-icon
                    pack="fa"
                    icon="angle-down"
                    custom-class="is-size-5"
                  >
                  </b-icon>
                </span>

                <b-dropdown-item
                  v-for="(value, key) in sortTypes"
                  :key="`sort-${key}`"
                  :value="key"
                  class="is-unselectable"
                >
                  {{value}}
                </b-dropdown-item>
              </b-dropdown>
            </h2>
            <p
              class="subtitle is-size-6 has-text-grey">
              Page {{page}}
            </p>

            <div class="content is-size-5 is-size-6-touch">
              <b-dropdown
                v-model="platformModel"
                @change="platformChanged"
                position="is-bottom-left"
                class="is-block"
              >
                <div
                  slot="trigger"
                  class="dropdown__trigger is-unselectable"
                >
                  <span class="has-text-weight-bold">Platform</span>
                  <div class="is-pulled-right">
                    {{currPlatformName}}
                    <b-icon
                      pack="fa"
                      icon="angle-down"
                      custom-class="is-size-5"
                    ></b-icon>
                  </div>
                </div>

                <b-dropdown-item
                  v-for="(platform, key) in platforms"
                  :key="key"
                  :value="key"
                  class="is-unselectable"
                >
                  {{platform.name}}
                </b-dropdown-item>
              </b-dropdown>
            </div>

            <div class="content is-size-5 is-size-6-touch">
              <b-dropdown
                v-model="typeModel"
                @change="typeChanged"
                position="is-bottom-left"
                class="is-block"
              >
                <div
                  slot="trigger"
                  class="dropdown__trigger is-unselectable"
                >
                  <span class="has-text-weight-bold">Type</span>
                  <div class="is-pulled-right">
                    {{currTypeName}}
                    <b-icon
                      pack="fa"
                      icon="angle-down"
                      custom-class="is-size-5"
                    ></b-icon>
                  </div>
                </div>

                <b-dropdown-item
                  value="any"
                  class="is-unselectable"
                >
                  Any
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(type, key) in jobTypes"
                  :key="key"
                  :value="key"
                  class="is-unselectable"
                >
                  <icon-gta :icon="type.icon"></icon-gta>
                  <span>{{type.name}}</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>

            <div
              v-if="currTypeInfo && currTypeInfo.modes"
              class="content is-size-5 is-size-6-touch"
            >
              <b-dropdown
                v-model="modeModel"
                @change="modeChanged"
                position="is-bottom-left"
                class="is-block"
              >
                <div
                  slot="trigger"
                  class="dropdown__trigger is-unselectable"
                >
                  <span class="has-text-weight-bold"><span class="is-hidden-touch">Game </span>Mode</span>
                  <div class="is-pulled-right">
                    {{currModeName}}
                    <b-icon
                      pack="fa"
                      icon="angle-down"
                      custom-class="is-size-5"
                    ></b-icon>
                  </div>
                </div>

                <b-dropdown-item
                  value="any"
                  class="is-unselectable"
                >
                  Any
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(mode, key) in currTypeInfo.modes"
                  :key="key"
                  :value="key"
                  class="is-unselectable"
                >
                  <icon-gta :icon="currTypeInfo.icon"></icon-gta>
                  <span>{{mode.name}}</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="columns is-multiline">
          <div
            class="column is-half-widescreen is-12-tablet"
            v-for="job in jobs"
            :key="job.jobId"
          >
            <job-card :job="job"></job-card>
          </div>
          <div
            v-if="!count"
            class="column iis-two-thirds-widescreen is-half-tablet"
          >
              <b-notification
                type="is-info"
                :closable="false"
                has-icon
              >
                <div class="notification__header">No jobs found</div>
                <p>Try to change a platform or a game mode.</p>
              </b-notification>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import findIndex from 'lodash/findIndex';
import throttle from 'lodash/throttle';
import {platforms, jobTypes} from '@/../config/static';

import JobCard from '@/components/JobCard.vue';
import IconGta from '@/components/IconGta.vue';
import BDropdown from '@/components/buefy-overrided/Dropdown.vue';

export default {
  props: {
    minInfo: {
      type: Boolean,
      default: false
    }
  },

  components: {
    JobCard,
    IconGta,
    BDropdown
  },

  beforeMount() {
    this.defineModels(this.$route);
  },

  mounted() {
    // const {filters} = this.$refs;
    // // 12 means 10px + "a little bit"
    // this.filtersInitialTopCoord = Math.floor(filters.getBoundingClientRect().top + window.pageYOffset) - 12;
    // filters.style.width = `${filters.clientWidth}px`;
    // addEventListener('scroll', this.filterFixingOnScroll);
  },

  beforeDestroy() {
    // removeEventListener('scroll', this.filterFixingOnScroll);
  },

  data() {
    return {
      platforms,
      jobTypes,
      sortTypes: {
        relevance: 'Most relevant',
        growth: 'Trending',
        updated: 'By update date',
        newest: '🔥 Newest',
        rating: 'By likes',
        featured: 'Featured'
      },
      sortModel: '',
      typeModel: '',
      modeModel: '',
      platformModel: '',

      filtersInitialTopCoord: 0
    };
  },

  watch: {
    $route(to) {
      this.defineModels(to);
    }
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'count'
    ]),

    ...mapState('route', {
      page: state => Number(state.query.page) || 1
    }),

    currPlatformName() {
      const {platformModel} = this;

      return platformModel
        ? platforms[this.platformModel].name
        : '';
    },

    currTypeInfo() {
      const {typeModel} = this;

      return typeModel
        ? jobTypes[this.typeModel]
        : null;
    },

    currModeInfo() {
      const {currTypeInfo, modeModel} = this;

      if (currTypeInfo && modeModel) {
        return currTypeInfo.modes
          ? currTypeInfo.modes[modeModel]
          : null;
      }

      return null;
    },

    currTypeName() {
      const {currTypeInfo} = this;

      return currTypeInfo
        ? currTypeInfo.name
        : 'Any';
    },

    currModeName() {
      const {currModeInfo} = this;

      return currModeInfo
        ? currModeInfo.name
        : 'Any'
    }
  },

  methods: {
    filterFixingOnScroll: throttle(function() {
      const fixedClassName = 'filters_fixed';
      const {filtersInitialTopCoord} = this;
      const {filters} = this.$refs;
      const fixed = filters.classList.contains(fixedClassName);
      const {pageYOffset} = window;

      if (!fixed && pageYOffset > filtersInitialTopCoord
        || fixed && pageYOffset < filtersInitialTopCoord) {
        filters.classList.toggle(fixedClassName);
      }
    }, 10),

    defineModels(route) {
      const {query} = route;

      this.sortModel = query.by || 'relevance';
      this.typeModel = query.type || 'any';
      this.modeModel = query.mode || 'any';

      const cookiePlatform = this.$cookie.get('platform');

      if (cookiePlatform && Object.keys(platforms).includes(cookiePlatform)) {
        this.platformModel = cookiePlatform;
      } else {
        this.platformModel = 'pc';
      }
    },

    platformChanged(platform) {
      this.$cookie.set('platform', platform, {expires: '1Y'});
      this.$router.push({
        query: { ...this.$route.query, platform }
      });
    },

    sortChanged(value) {
      this.$router.push({
        query: { ...this.$route.query, by: value, page: 1 }
      });
    },

    typeChanged(value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          type: value,
          mode: '',
          page: 1
        }
      })
    },

    modeChanged(value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          mode: value,
          page: 1
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/scss/vars.scss";

// .title__special {
//   font-family: 'Oswald', sans-serif;
// }

.dropdown__trigger {
  cursor: pointer;

  &:hover {
    color: $primary;
  }
}

.filters {
  position: sticky;
  transition-duration: 2s;
}

.filters_fixed {
  position: fixed;
  top: 10px;
}

.filters__main {
  background: linear-gradient(to bottom, rgba(132, 0, 0, 0.1), transparent);
}
</style>
