<template>
  <div>
    <div class="columns is-multiline">
      <div
        class="column is-one-third-widescreen is-half-tablet">
        <div class="box is-shadowless" style="height: 100%; background: linear-gradient(to bottom, hsla(0, 100%, 26%, 10%), transparent)">
          <h2 class="is-size-4">
            <b-dropdown
              v-model="sort"
              @change="sortChanged"
            >
              <span
                slot="trigger"
                class="dropdown__trigger is-unselectable"
              >
                {{ sortTypes[sort] }}
                <span class="has-text-primary">
                  {{ number | formatNumber }} jobs
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
                class="is-unselectable">{{ value }}</b-dropdown-item>
            </b-dropdown>
          </h2>
          <p
            class="subtitle is-size-6 has-text-grey">
            Page {{ page }}
          </p>

          <div
            class="content"
            :class="{ 'is-hidden-tablet': filtersShown }"
          >
            <div
              class="button is-block is-primary is-outlined"
              @click="showFilters"
            >
              <b-icon
                pack="fa"
                size="is-small"
                icon="filter"
              ></b-icon>
              <span>Toggle filters</span>
            </div>

          </div>

          <div
            v-show="filtersShown"
            ref="filters"
            class="is-hidden-mobile"
          >
            <div class="content is-size-5">
              <b-dropdown
                v-model="currType"
                @change="typeChanged"
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
                  v-for="(type, i) in modes"
                  :key="`type-${i}`"
                  :value="i + 1"
                  class="is-unselectable"
                >
                  <icon-gta :icon="type.icon"></icon-gta>
                  <span>{{ type.name }}</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>

            <div
              class="content is-size-5"
              v-if="currTypeInfo && currModeInfo"
            >
              <b-dropdown
                v-model="currMode"
                @change="modeChanged"
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
      <div
        class="column is-one-third-widescreen is-half-tablet"
        v-for="job in jobs"
        :key="job.jobId"
      >
        <job-card :job="job"></job-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import modes from '@/../config/static/modes';

import JobCard from '@/components/JobCard.vue';
import IconGta from '@/components/IconGta.vue';

export default {
  props: {
    minInfo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      filtersShown: true,
      modes,
      sortTypes: {
        '': 'Most relevant',
        growth: 'Trending',
        updated: 'By update date',
        newest: '🔥 Newest',
        rating: 'By likes',
        featured: 'Featured'
      }
    };
  },

  components: {
    JobCard,
    IconGta
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'number'
    ]),

    ...mapState('route', {
      sort: state => state.query.by || '',
      page: state => Number(state.query.page) || 1,
      currType: state => Number(state.query.type) || 0,
      currMode: state => Number(state.query.mode) || 0
    }),

    currTypeInfo() {
      return modes[this.currType - 1];
    },

    currModeInfo() {
      if (this.currTypeInfo) {
        return this.currTypeInfo.modes;
      }
    },

    currTypeName() {
      const typeInfo = this.currTypeInfo;
      return typeInfo
        ? typeInfo.name
        : 'Any';
    },

    currModeName() {
      const modeInfo = this.currModeInfo[this.currMode - 1];
      return modeInfo
        ? modeInfo
        : 'Any'
    }
  },

  methods: {
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
</style>
