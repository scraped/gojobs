<template>
  <div
    class="card"
    style="height: 100%;"
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
          <img
            :src="jobExt.imageUrl"
            :alt="job.name"
          >
        </figure>
        <div
          class="card__strip"
          :class="ratingCssClass(job.stats.rstRating)"
          :style="`width: ${job.stats.rating}%;`"
        ></div>
        <div class="card__tags">
          <div class="tags">
            <!-- <span class="tag is-dark is-rounded">Pitlane</span> -->
          </div>
        </div>
        <div class="card__title">
          <div class="is-size-5 has-text-white">
            <span
              class="tooltip is-tooltip-light"
              :data-tooltip="`Game mode: ${jobExt.scTypeName}`"
            >
              <icon-gta :icon="jobExt.scTypeIcon"></icon-gta>
            </span><span class="has-text-weight-bold" v-html="job.name"></span>
            <span
              v-if="jobExt.recentlyAdded"
              class="tooltip"
              data-tooltip="Added less than 2 weeks ago"
            >
              🔥
            </span>
          </div>
        </div>
      </div>
    </router-link>

    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <router-link
              :to="{ name: 'profile', params: { username: job.author }}"
            >
              <img
                class="is-rounded"
                :src="avatars.small"
              >
            </router-link>
          </figure>
        </div>

        <div class="media-content">
          <div class="is-size-6">
            <template v-if="job.author">
              <router-link
                :to="{ name: 'profile', params: { username: job.author }}"
              >
                @{{ job.author }}
              </router-link>
            </template>
            <template v-if="job.rockstar">
              <span class="tag is-primary">
                <template v-if="job.author">
                  Rockstar Verified
                </template>
                <template v-else>
                  Rockstar Job
                </template>
              </span>
            </template>
          </div>
        </div>

        <div class="media-right">
          <b-icon
            pack="fa"
            icon="bookmark"
            type="is-dark"
          ></b-icon>
        </div>
      </div>

      <div class="is-size-7 has-text-grey">
        <div>
          <template v-if="!job.rockstar">
            {{ jobExt.platformName }} ·
          </template>
          <template v-if="jobExt.playersNumberText">
            {{jobExt.playersNumberText}} ·
          </template>
          {{ updatedDate }}
          <!-- <br>Points: {{ job.stats.points }} -->
        </div>
        <div>
          <router-link :to="{ query: Object.assign({}, $route.query, { type: job.scType, mode: job.scMode }) }">
            {{ jobExt.scModeName || jobExt.scTypeName }}
          </router-link>
          within the game
        </div>
      </div>
      <br>

      <div class="field is-grouped is-grouped-multiline">
        <div class="control">
          <div
            class="tags has-addons"
            :class="{ tooltip: !primaryInfo }"
            data-tooltip="R* also takes into account unfinished jobs"
          >
            <span
              class="tag is-rounded is-medium"
              :class="ratingCssClass(job.stats.rstRating)"
            >
              <span class="icon">
                <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
              </span>
              <span v-if="primaryInfo">{{ job.stats.like | formatNumber }}</span>
              <span v-else>{{ job.stats.rating + '%' }}</span>
            </span>
            <span class="tag is-light is-rounded is-medium has-text-grey-light">
              <span
                v-if="primaryInfo"
                class="icon"
              >
                <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
              </span>
              <span v-if="primaryInfo">{{ job.stats.dislike | formatNumber }}</span>
              <span v-else>{{job.stats.rstRating}}% (rockstar)</span>
            </span>
          </div>
        </div>

        <div class="control">
          <span class="tag is-light is-rounded is-medium">
            <span class="icon">
              <i
                class="fa fa-gamepad fa-lg"
                :class="primaryInfo ? 'fa-gamepad' : 'fa-users'"
                aria-hidden="true"
              ></i>
            </span>
            <span v-if="primaryInfo">{{ job.stats.plTot | formatNumber }}</span>
            <span v-else>{{ job.stats.plUnq | formatNumber }}</span>
          </span>
        </div>

        <div class="control is-expanded">
          <span
            class="button is-rounded is-white has-text-grey-light is-pulled-right tooltip"
            data-tooltip="Click here to see different stats"
            @click="primaryInfo = !primaryInfo"
          >
            <b-icon icon="ellipsis-h"></b-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {
  userAvatars,
  ratingCssClass,
  updatedDate,
  scTypeModeIcon,
  scPlatformName,
} from '@/helpers';

import {ratingMixin} from '@/mixins';

import IconGta from '@/components/IconGta.vue';

export default {
  mixins: [
    ratingMixin
  ],

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
      primaryInfo: true
    };
  },

  computed: {
    ...mapGetters('job', {
      jobExtGetter: 'jobExt'
    }),

    jobExt() {
      return this.jobExtGetter(this.job);
    },

    avatars() {
      return userAvatars(this.job.author);
    },

    updatedDate() {
      const { ver } = this.job;
      return updatedDate({ date: this.job.scUpdated, ver });
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/vars.scss";

$card-image-hover-scale: 1.03;
$card-image-hover-transition-duration: 350ms;

$card-strip-height: 4px;
$card-strip-opacity: 0.5;

.card__image {
  position: relative;
  img {
    transition-duration: $card-image-hover-transition-duration;
  }
  &:hover img {
    transform: scale($card-image-hover-scale);
  }
  &:hover .card__tags {
    opacity: 1.0;
  }
}

.card__title {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, rgba($black, 0.45), transparent);
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

.card__tags {
  position: absolute;
  top: $card-strip-height;
  opacity: 0.6;
  padding: 1rem 1.5rem;
  transition-duration: $card-image-hover-transition-duration;
}

.card__footer {
  cursor: pointer;
  opacity: 0.9;
  transition-duration: 100ms;
  &:hover {
    opacity: 1;
  }
}
</style>
