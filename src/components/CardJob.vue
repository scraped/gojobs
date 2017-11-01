<template>
  <div class="card">
    <div class="card-image" style="position: relative;">
      <div :class="'card-strip is-' + ratingCssClass" :style="'width: ' + job.stats.rating + '%;'"></div>
      <div class="card-title">
        <div class="title is-5">
          <span
            class="tooltip has-text-weight-normal"
            :data-tooltip="job.job.mode.name">
              <icon-gta :icon="job.job.mode.icon"></icon-gta>
          </span><span v-html="job.name"></span>
        </div>
      </div>
      <div class="image is-2by1">
        <img :src="job.image" :title="job.name">
      </div>
    </div>

    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image image-avatar is-48x48">
            <div
              class="image-avatar-medal tooltip is-tooltip-right"
              :style="`background: url('/images/medal-${job.author.medal}.png')`"
              data-tooltip="Creator Rockstar Medal">
            </div>
            <router-link
              :to="{ path: '/', query: genQuery({ author: job.author.username }) }">
                <img class="is-rounded" :src="job.author.avatar.small">
            </router-link>
          </figure>
        </div>

        <div class="media-content">
          <p class="subtitle is-6">
            <router-link
              :to="{ path: '/', query: genQuery({ author: job.author.username }) }">
                @{{ job.author.username }}
            </router-link>
            <router-link
              :to="{ path: '/', query: genQuery({ crew: job.crew.crewUrl }) }"
              v-if="job.crew">
            <span
              class="tag is-white tooltip is-tooltip-right"
              :style="'border: 1px solid #' + job.crew.color"
              v-if="job.crew"
              :data-tooltip="job.crew.name ? job.crew.name : '<Name not loaded>'">
              {{ job.crew.tag }}</span>
            </router-link><br>
            <span class="subtitle-date">
              {{ dateReadable }}
            </span>
          </p>
        </div>

        <!-- <div class="media-right">
          Test
        </div> -->
      </div>

      <div class="tags">
        <span class="tag">{{ job.platform.name }}</span>
        <span class="tag">{{ job.job.maxpl }} players</span>
      </div>
    </div>

    <div class="card-footer">
      <div
        class="card-footer-item tooltip"
        :data-tooltip="'People played this: ' + job.stats.pldUnq">
        <span class="icon">
          <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
        </span>
        {{ job.stats.pldTot | formatNumber }}</div>

      <div
        class="card-footer-item tooltip"
        :data-tooltip="'Dislikes: ' + job.stats.dlikes + ', optimal rating: ' + job.stats.ratingQuit + '%'">
        <span class="icon">
          <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
        </span>
        {{ job.stats.likes | formatNumber }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import modes from '../../config/modes';
import IconGta from './IconGta.vue';

export default {
  props: ['jobObj'],

  components: {
    IconGta
  },

  data () {
    return {
      job: this.jobObj,
      dateReadable: this.getDateReadable()
    };
  },

  computed: {
    ratingCssClass () {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    }
  },

  filters: {
    formatNumber (num) {
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
      if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
      return num;
    }
  },

  methods: {
    genQuery (obj) {
      return Object.assign({}, this.$route.query, { page: 1 }, obj);
    },

    getDateReadable () {
      let job = this.jobObj;
      let dateString = moment(job.updated.job).fromNow();
      if (job.category || job.updated.ver === 1) {
        return `Added ${dateString}`;
      } else {
        return `Updated ${dateString} (version ${job.updated.ver})`;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../scss/bulma/utilities/variables";
.card {
  box-shadow: none;
}

.card-title {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  .title {
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
  }
}

.card-strip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 5px;
  opacity: 0.6;
  &.is-success {
    background: $success;
  }
  &.is-warning {
    background: $warning;
  }
  &.is-danger {
    background: $danger;
  }
}

.subtitle-date {
  margin-top: 2px;
  font-size: 0.9em;
  font-style: italic;
}

.image-avatar {
  position: relative;
  .image-avatar-medal {
    position: absolute;
    z-index: 100;
    background: red;
    right: 1%;
    bottom: 1%;
    width: 13px;
    height: 13px;
    border: 3px solid #ffffff;
    border-radius: 100%;
  }
}
</style>
