<template>
  <div
    class="card"
    :class="{ 'is-bad': job.bad }"
  >
    <!-- <div style="position: absolute; bottom: 0%; right: 15%; opacity: 0.08; font-size: 100px;">
      <icon-gta
        v-if="job.scModeIcon"
        :icon="job.scModeIcon">
      </icon-gta>
    </div> -->
    <router-link :to="{
      name: 'job',
      params: { id: job.jobId, slug: job.slug }
    }">
      <div class="card__image">
        <figure class="image is-2by1 is-clipped">
          <img :src="job.imageUrl" :alt="job.name">
        </figure>
        <div
          class="card__strip"
          :class="ratingCssClass"
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
          <figure class="image is-48x48">
            <router-link
              :to="{ name: 'profile', params: { username: job.author }}">
              <img class="is-rounded" :src="avatars.small">
            </router-link>
          </figure>
        </div>

        <div class="media-content">
          <div class="is-size-6">
            <template v-if="job.author">
              <router-link
                :to="{ name: 'profile', params: { username: job.author }}">
                @{{ job.author }}
              </router-link>
            </template>
            <template v-if="job.rockstar">
              <span class="tag is-primary">
                <template v-if="job.author">
                  Rockstar Verified Job
                </template>
                <template v-else>
                  Rockstar Job
                </template>
              </span>
            </template>
          </div>
        </div>

        <!-- <div class="media-right"></div> -->
      </div>

      <div class="is-size-7 has-text-grey">
        <div>
          <template v-if="!job.rockstar">
            {{ job.platformName }} ·
          </template>
          {{ job.maxPl }} players ·
          {{ updatedDate }}
          <!-- <br>Points: {{ job.stats.points }} -->
        </div>
        <div>
          In-game category: {{ job.scModeName || job.scTypeName }}
        </div>
      </div>
      <br>

      <div class="field is-grouped is-grouped-multiline">
        <div class="control">
          <div
            class="tags has-addons tooltip"
            :data-tooltip="`Real rating: ${job.stats.rating}%, RGSC rating: ${job.stats.ratingQuit}%`">
            <span
              class="tag is-rounded is-medium"
              :class="ratingCssClass">
              <span class="icon">
                <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
              </span>
              <span>{{ job.stats.likes | formatNumber }}</span></span>
            <span
              class="tag is-light is-rounded is-medium has-text-grey-light">
              <span class="icon">
                <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
              </span>
              <span>{{ job.stats.dislikes | formatNumber }}</span></span>
          </div>
        </div>

        <div class="control">
          <span
            class="tag is-light is-rounded is-medium tooltip"
            :data-tooltip="job.stats.playUnq  | formatNumber('People played this')">
            <span class="icon">
              <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
            </span>
            <span>{{ job.stats.playTot | formatNumber }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rockstarIcon from 'src/images/rockstar-2.png';

import IconGta from 'src/components/IconGta.vue';
import {
  userAvatars,
  rgscRatingCssClass,
  updatedDate
} from 'src/helpers';

export default {
  props: {
    job: {
      type: Object
    }
  },

  components: {
    IconGta
  },

  data() {
    return {
      rockstarIcon
    }
  },

  computed: {
    avatars() {
      return userAvatars(this.job.author);
    },

    ratingCssClass() {
      return rgscRatingCssClass(this.job.stats.ratingQuit);
    },

    updatedDate() {
      const { ver } = this.job;
      return updatedDate({ date: this.job.scUpdated, ver });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "src/scss/vars";

$card-image-hover-scale: 1.03;
$card-image-hover-transition-duration: 350ms;

$card-strip-height: 4px;
$card-strip-opacity: 0.5;

.is-bad {
  opacity: 0.25;
}

.card__image {
  position: relative;
  img {
    transition-duration: $card-image-hover-transition-duration;
  }
  &:hover img {
    transform: scale($card-image-hover-scale);
  }
}

.card__title {
  position: absolute;
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
  height: $card-strip-height;
  opacity: $card-strip-opacity;
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
