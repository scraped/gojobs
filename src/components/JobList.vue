<template>
  <div>
    <h1
      v-if="!minInfo"
      class="title">
      GTA Online Jobs
    </h1>

    <div class="columns is-multiline">
      <div
        class="column is-one-third-widescreen is-half-tablet">
        <div class="box" style="height: 100%; background: hsla(0, 100%, 26%, 10%)">
          <h2 class="is-size-4">
            <b-dropdown v-model="sort" @change="sortChanged">
              <span
                slot="trigger"
                class="dropdown__trigger is-unselectable"
              >
                {{ sortTypes[sort] }}
                <span class="has-text-primary">{{ number }} jobs</span>
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

          <div class="content">
            <h5>
              Type
              <router-link
                v-if="$route.query.type"
                :to="{ query: Object.assign({}, $route.query, { type: '' }) }"
              >
                <b-icon pack="fa" icon="remove" size="is-small"></b-icon>
              </router-link>
            </h5>
            <div class="buttons">
              <router-link
                v-for="(type, i) in modes"
                :key="i"
                :to="{ query: Object.assign({}, $route.query, { type: i + 1 }) }"
                class="button is-small is-rounded is-dark"
                exact-active-class="is-primary">
                <icon-gta :icon="type.icon" class="is-hidden-touch"></icon-gta>
                <span>{{ type.name }}</span>
                <!-- <b-icon v-if="$route.query.type === i + 1" pack="fa" icon="close" size="is-small"></b-icon> -->
              </router-link>
            </div>

            <template v-if="$route.query.type && modes[$route.query.type - 1].modes">
              <h5>
                Game Mode
                <router-link
                  v-if="$route.query.mode"
                  :to="{ query: Object.assign({}, $route.query, { mode: '' }) }"
                >
                  <b-icon pack="fa" icon="remove" size="is-small"></b-icon>
                </router-link>
              </h5>
              <div class="buttons">
                <router-link
                  v-for="(mode, j) in modes[$route.query.type - 1].modes"
                  :key="mode"
                  :to="{ query: Object.assign({}, $route.query, { mode: j + 1 }) }"
                  class="button is-small is-rounded is-light"
                  exact-active-class="has-text-primary"
                  active-class="">
                  <icon-gta
                    :icon="modes[$route.query.type - 1].icons[j]"
                    class="is-hidden-touch">
                  </icon-gta>
                  <span>{{ mode }}</span>
                </router-link>
              </div>
            </template>

            <h5>Author</h5>
            <div class="buttons">
              <router-link :to="{ query: { rockstar: 1 } }" class="button is-light is-small is-rounded">Rockstar</router-link>
              <router-link :to="{ query: { rockstarverified: 1 } }" class="button is-light is-small is-rounded">Rockstar Verified</router-link>
            </div>
          </div>
        </div>
      </div>
      <div
        class="column is-one-third-widescreen is-half-tablet"
        v-for="job in jobs"
        :key="job.jobId">
        <job-card :job="job"></job-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
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
      modes,
      sortTypes: {
        '': 'Trending',
        rating: 'Likes',
        featured: 'Featured',
        updated: 'Updated',
        newest: '🔥 Newest'
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
      page: state => Number(state.query.page) || 1
    })
  },

  beforeMount() {
    console.log(this.$route.query)
  },

  methods: {
    sortChanged(value) {
      this.$router.push({
        query: { ...this.$route.query, by: value, page: 1 }
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/scss/vars.scss";

.dropdown__trigger {
  cursor: pointer;

  &:hover {
    color: $primary;
  }
}
</style>

