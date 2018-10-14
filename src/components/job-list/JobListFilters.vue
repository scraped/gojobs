<template>
  <div
    ref="filters"
    class="filters"
  >
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
            />
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

      <div class="block is-size-5 is-size-6-touch">
        <b-dropdown
          v-model="platformModel"
          :disabled="isRockstar"
          class="is-block"
          position="is-bottom-left"
          @change="platformChanged"
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
              />
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

      <div class="block is-size-5 is-size-6-touch">
        <b-dropdown
          v-model="typeModel"
          class="is-block"
          position="is-bottom-left"
          @change="typeChanged"
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

      <div class="block is-size-5 is-size-6-touch">
        <b-dropdown
          v-model="modeModel"
          :disabled="!modeSelectable"
          class="is-block"
          position="is-bottom-left"
          @change="modeChanged"
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
              />
            </div>
          </div>

          <b-dropdown-item
            value="any"
            class="is-unselectable"
          >
            Any
          </b-dropdown-item>
          <template v-if="modeSelectable">
            <b-dropdown-item
              v-for="(mode, key) in currTypeInfo.modes"
              :key="key"
              :value="key"
              class="is-unselectable"
            >
              <icon-gta :icon="currTypeInfo.icon"/>
              <span>{{mode.name}}</span>
            </b-dropdown-item>
          </template>
        </b-dropdown>
      </div>

      <div class="block is-size-5 is-size-6-touch">
        <b-dropdown
          v-model="authorModel"
          position="is-bottom-left"
          class="is-block"
          @change="authorChanged"
        >
          <div
            slot="trigger"
            class="dropdown__trigger is-unselectable"
          >
            <span class="has-text-weight-bold">Author</span>
            <div class="is-pulled-right">
              {{currAuthor}}
              <b-icon
                pack="fa"
                icon="angle-down"
                custom-class="is-size-5"
              />
            </div>
          </div>

          <b-dropdown-item
            v-for="(author, key) in authorTypes"
            :key="key"
            :value="key"
            class="is-unselectable"
          >
            {{author}}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import IconGta from '@/components/IconGta.vue';
import BDropdown from '@/components/buefy-overrided/Dropdown.vue';

import {platforms, jobTypes} from '@/../config/static';

const sortTypes = {
  relevance: 'Most relevant',
  growth: 'Trending',
  updated: 'By update date',
  newest: '🔥 Newest',
  rating: 'By likes',
  featured: 'Featured',
};

const authorTypes = {
  members: 'All users',
  rockstar: 'Rockstar',
  verified: 'Rockstar verified',
};

export default {
  components: {
    IconGta,
    BDropdown,
  },

  data() {
    return {
      platforms,
      jobTypes,
      sortTypes,
      authorTypes,

      sortModel: '',
      typeModel: '',
      modeModel: '',
      platformModel: '',
      authorModel: '',

      filtersInitialTopCoord: 0,
    };
  },

  computed: {
    ...mapState('jobs', [
      'count',
    ]),

    ...mapState('route', {
      page: state => Number(state.query.page) || 1
    }),

    modeSelectable() {
      const {currTypeInfo} = this;
      return currTypeInfo && currTypeInfo.modes;
    },

    isRockstar() {
      const {authorModel} = this;
      return authorModel === 'rockstar'
        || authorModel === 'verified';
    },

    currPlatformName() {
      const {platformModel} = this;

      return platformModel
        ? platforms[platformModel].name
        : '';
    },

    currAuthor() {
      const {authorModel} = this;

      return authorModel
        ? authorTypes[authorModel]
        : '';
    },

    currTypeInfo() {
      const {typeModel} = this;

      return typeModel
        ? jobTypes[typeModel]
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
        : 'Any';
    },
  },

  watch: {
    $route(to) {
      this.defineModels(to);
    },
  },

  beforeMount() {
    this.defineModels(this.$route);
  },

  mounted() {
    const {filters} = this.$refs;
    // 12 means 10px + "a little bit"
    this.filtersInitialTopCoord = Math.floor(filters.getBoundingClientRect().top + window.pageYOffset) - 12;
    filters.style.width = `${filters.clientWidth}px`;
    window.addEventListener('scroll', this.filterFixingOnScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.filterFixingOnScroll);
  },

  methods: {
    filterFixingOnScroll() {
      const fixedClassName = 'filters_fixed';
      const {filtersInitialTopCoord} = this;
      const {filters} = this.$refs;
      const fixed = filters.classList.contains(fixedClassName);
      const {pageYOffset} = window;

      if (!fixed && pageYOffset > filtersInitialTopCoord
        || fixed && pageYOffset < filtersInitialTopCoord) {
        filters.classList.toggle(fixedClassName);
      }
    },

    defineModels(route) {
      const {query} = route;

      this.sortModel = query.by || 'relevance';
      this.typeModel = query.type || 'any';
      this.modeModel = query.mode || 'any';
      this.authorModel = query.cat || 'members';

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
        query: {...this.$route.query, platform},
      });
    },

    sortChanged(value) {
      this.$router.push({
        query: {...this.$route.query, by: value, page: 1},
      });
    },

    typeChanged(value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          type: value,
          mode: '',
          page: 1,
        },
      });
    },

    modeChanged(value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          mode: value,
          page: 1,
        },
      });
    },

    authorChanged(value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          cat: value,
          page: 1,
        },
      });
    },
  },
};
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

.filters_fixed {
  position: fixed;
  top: 1rem;
}

.filters__main {
  background: linear-gradient(to bottom, rgba(132, 0, 0, 0.1), transparent);
}
</style>
