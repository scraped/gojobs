<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-one-third-widescreen is-two-fifths-desktop is-two-fifths-tablet">
        <div class="filters">
          <div class="filters__main box is-shadowless">
            <h2 class="is-size-4">
              <b-dropdown
                v-model="sortModel"
                position="is-bottom-left"
                @change="sortChanged"
              >
                <span
                  slot="trigger"
                  class="dropdown__trigger is-unselectable"
                >
                  {{ sortTypes[sortModel] }}
                  <span class="has-text-primary">
                    {{ count | formatNumber }} jobs
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
                  {{ value }}
                </b-dropdown-item>
              </b-dropdown>
            </h2>
            <p
              class="subtitle is-size-6 has-text-grey">
              Page {{page}}
            </p>

            <div
              class="content"
              :class="{ 'is-hidden-tablet': filtersShown }"
            >
              <div
                class="button is-block is-primary"
                :class="{ 'is-outlined': filtersShown }"
                @click="showFilters"
              >
                <b-icon
                  pack="fa"
                  size="is-small"
                  icon="filter"
                ></b-icon>
                <span>{{ filtersText }}</span>
              </div>

            </div>

            <div
              v-show="filtersShown"
              ref="filters"
              class="is-hidden-mobile"
            >
              <div class="content is-size-5">
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
                      {{ currPlatformName }}
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

              <div class="content is-size-5">
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
                      {{ currTypeName }}
                      <b-icon
                        pack="fa"
                        icon="angle-down"
                        custom-class="is-size-5"
                      ></b-icon>
                    </div>
                  </div>

                  <b-dropdown-item
                    :value="0"
                    class="is-unselectable"
                  >
                    Any
                  </b-dropdown-item>
                  <!-- <b-dropdown-item
                    v-for="(type, i) in modes"
                    :key="type.name"
                    :value="i + 1"
                    class="is-unselectable"
                  >
                    <icon-gta :icon="type.icon"></icon-gta>
                    <span>{{ type.name }}</span>
                  </b-dropdown-item> -->
                </b-dropdown>
              </div>

              <div
                v-if="currTypeInfo && currModeInfo"
                class="content is-size-5"
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
                    <span class="has-text-weight-bold">Game Mode</span>
                    <div class="is-pulled-right">
                      {{ currModeName }}
                      <b-icon
                        pack="fa"
                        icon="angle-down"
                        custom-class="is-size-5"
                      ></b-icon>
                    </div>
                  </div>

                  <b-dropdown-item
                    :value="0"
                    class="is-unselectable"
                  >
                    Any
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-for="(mode, i) in currModeInfo"
                    :key="`mode-${i}`"
                    :value="i + 1"
                    class="is-unselectable"
                  >
                    <icon-gta :icon="currTypeInfo.icons[i]"></icon-gta>
                    <span>{{ mode }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
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

  data() {
    return {
      platforms,
      jobTypes,
      filtersShown: true,
      sortTypes: {
        relevance: 'Most relevant',
        growth: 'Trending',
        updated: 'By update date',
        newest: '🔥 Newest',
        rating: 'By likes',
        featured: 'Featured'
      },
      sortModel: null,
      typeModel: null,
      modeModel: null,
      platformModel: null,
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

    filtersText() {
      return this.filtersShown
        ? 'Hide filters'
        : 'Show filters';
    },

    currPlatformName() {
      // return platforms[this.platformModel].name;
    },

    currTypeInfo() {
      return {};
      // return modes[this.typeModel - 1];
    },

    currModeInfo() {
      return {};
      // if (this.currTypeInfo) {
      //   return this.currTypeInfo.modes;
      // }
    },

    currTypeName() {
      return '';
      // const typeInfo = this.currTypeInfo;
      // return typeInfo
      //   ? typeInfo.name
      //   : 'Any';
    },

    currModeName() {
      return '';
      // const modeInfo = this.currModeInfo[this.modeModel - 1];
      // return modeInfo
      //   ? modeInfo
      //   : 'Any'
    }
  },

  methods: {
    defineModels(route) {
      this.sortModel = route.query.by || 'relevance';
      this.typeModel = Number(route.query.type) || 0;
      this.modeModel = Number(route.query.mode) || 0;

      const cookiePlatform = this.$cookie.get('platform');
      if (cookiePlatform && Object.keys(platforms).includes(cookiePlatform)) {
        this.platformModel = cookiePlatform;
      } else {
        this.platformModel = 'pc';
      }
    },

    platformChanged(platform) {
      this.$cookie.set('platform', platform, {expires: '1Y'});
      this.$router.push({query: { ...this.$route.query, platform }});
    },

    sortChanged(value) {
      this.$router.push({
        query: { ...this.$route.query, by: value, page: 1 }
      });
    },

    showFilters() {
      this.$refs.filters.classList.remove('is-hidden-mobile');
      this.filtersShown = !this.filtersShown;
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

}

.filters__main {
  background: linear-gradient(to bottom, hsla(0, 100%, 26%, 10%), transparent);
}
</style>
