<template>
  <div class="card">
    <div style="position: absolute; bottom: 0%; right: 15%; opacity: 0.08; font-size: 100px;">
      <icon-gta :icon="modes[job.job.gameType - 1].modes[job.job.gameMode - 1].icon"></icon-gta>
    </div>
    <router-link :to="{ name: 'job', params: { id: job.jobId } }">
      <div class="card-image">
        <figure class="image is-2by1">
          <img :src="job.image" :alt="job.name">
        </figure>
        <div
          :class="`card-strip is-${ratingCssClass}`"
          :style="`width: ${job.stats.rating}%;`">
        </div>
        <div class="card-title">
          <div class="title is-5">
            <span
              class="tooltip has-text-weight-normal"
              :data-tooltip="`Game mode:`">
                <!-- <icon-gta :icon=""></icon-gta> -->
            </span><span v-html="job.name"></span>
          </div>
        </div>
      </div>
    </router-link>

    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image image-avatar is-48x48">
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
          </p>
        </div>

        <!-- <div class="media-right">
          Test
        </div> -->
      </div>

      <div class="is-size-7">
        <div>
          Not yet categorized
        </div>
        <div class="has-text-grey-light">
          In-game category:
          <router-link :to="''">{{ modes[job.job.gameType - 1].name }}</router-link>
          —
          <router-link :to="''">{{ modes[job.job.gameType - 1].modes[job.job.gameMode - 1].name }}</router-link>
          <br>
          {{ platforms[job.platform - 1].name }} · {{ job.job.maxpl }} players · {{ updatedDate }}
          <br>
          Points: {{ job.stats.points }}
        </div>
      </div>
      <br>

      <div class="tags">
        <span
          :class="`tag is-${ratingCssClass} is-rounded is-medium tooltip`"
          :data-tooltip="`Dislikes: ${job.stats.dislikes}, optimal rating: ${job.stats.ratingQuit}%`">
          <span class="icon">
            <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
          </span>
          <span>{{ job.stats.likes | formatNumber }}</span></span>
        <span
          class="tag is-light is-rounded is-medium tooltip"
          :data-tooltip="`People played this: ${job.stats.playUnq}`">
          <span class="icon">
            <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
          </span>
          <span>{{ job.stats.playTot | formatNumber }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import modes from '../../config/modes';
import platforms from '../../config/platforms';
import IconGta from './IconGta.vue';

export default {
  props: {
    job: { type: Object }
  },

  components: {
    IconGta
  },

  data () {
    return {
      modes,
      platforms
    };
  },

  computed: {
    ratingCssClass() {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    },

    updatedDate() {
      let { job } = this;
      let date = moment(job.dates.updated).fromNow();
      if (job.ver === 1) {
        return `added ${date}`;
      } else {
        return `${date} (version ${job.ver})`;
      }
    },
  },

  methods: {
    genQuery(obj) {
      return Object.assign({}, this.$route.query, { page: 1 }, obj);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/bulma/utilities/_all";

.card-image {
  overflow: hidden;
  .image {
    transition-duration: 0.5s;
  }
  &:hover .image {
    transform: scale(1.05);
  }
}

.card-title {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, rgba($black, 0.4), transparent);
  .title {
    color: rgba($white, 0.85);
    text-shadow: 1px 1px 10px rgba($black, 0.4);
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
</style>
