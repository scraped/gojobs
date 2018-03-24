<template>
  <div class="card">
    <div style="position: absolute; bottom: 0%; right: 15%; opacity: 0.08; font-size: 100px;">
      <icon-gta
        v-if="job.scModeIcon"
        :icon="job.scModeIcon">
      </icon-gta>
    </div>
    <router-link :to="{ name: 'job', params: { id: job.jobId } }">
      <div class="card__image">
        <figure class="image is-2by1">
          <img :src="job.imageUrl" :alt="job.name">
        </figure>
        <div
          :class="`card__strip is-${ratingCssClass}`"
          :style="`width: ${job.stats.rating}%;`">
        </div>
        <div class="card__title">
          <div class="title is-5">
            <span
              class="tooltip has-text-weight-normal"
              :data-tooltip="`Game mode: ${job.scTypeName}`">
                <icon-gta :icon="job.scTypeIcon"></icon-gta>
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
              :to="{ name: 'profile', params: { username: job.author }}">
              <img class="is-rounded" :src="avatars.small">
            </router-link>
          </figure>
        </div>

        <div class="media-content">
          <div class="is-size-6">
            <router-link
              :to="{ name: 'profile', params: { username: job.author }}">
              @{{ job.author }}
            </router-link>
          </div>
        </div>

        <!-- <div class="media-right"></div> -->
      </div>

      <div class="is-size-7 has-text-grey-light">
        <div class="has-text-grey-light">
          {{ job.platformName }} ·
          {{ job.maxPl }} players ·
          {{ updatedDate }}
          <!-- <br>Points: {{ job.stats.points }} -->
        </div>
        <div v-if="job.scModeName">
          In-game category: {{ job.scModeName }}
        </div>
      </div>
      <br>

      <div class="tags">
        <span
          :class="`tag is-${ratingCssClass} is-rounded is-medium tooltip`"
          :data-tooltip="`Dislikes: ${job.stats.dislikes}, RGSC rating: ${job.stats.ratingQuit}%`">
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
import {userAvatars} from 'src/helpers';
import IconGta from 'src/components/IconGta.vue';

export default {
  props: {
    job: {
      type: Object
    }
  },

  components: {
    IconGta
  },

  computed: {
    avatars() {
      return userAvatars(this.job.author);
    },

    ratingCssClass() {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    },

    updatedDate() {
      const date = moment(this.job.scUpdated).fromNow(),
        { ver } = this.job;

      if (ver === 1) {
        return `added ${date}`;
      } else {
        return `${date} (version ${ver})`;
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
@import "src/scss/vars";

.card__image {
  overflow: hidden;
  position: relative;
  .image {
    transition-duration: 0.5s;
  }
  &:hover .image {
    transform: scale(1.05);
  }
}

.card__title {
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

.card__strip {
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
