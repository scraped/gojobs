<template>
  <div class="card" style="height: 100%;">
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
          :class="ratingCssClass(job.stats.ratingQuit)"
          :style="`width: ${job.stats.rating}%;`"
        ></div>
        <div class="card__tags">
          <div class="tags">
            <!-- <span class="tag is-dark is-rounded">{{ jobExt.scModeName || jobExt.scTypeName }}</span> -->
            <!-- <span class="tag is-dark is-rounded">Rallycross</span> -->
            <!-- <span class="tag is-dark is-rounded">Pitlane</span> -->
          </div>
        </div>
        <div class="card__title">
          <div class="is-size-5 has-text-white">
            <span
              class="tooltip"
              :data-tooltip="`Game mode: ${scInfo.scTypeName}`">
              <icon-gta :icon="scInfo.scTypeIcon"></icon-gta>
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
          <b-icon pack="fa" icon="bookmark" type="is-dark"></b-icon>
        </div>
      </div>

      <div class="is-size-7 has-text-grey">
        <div>
          <template v-if="!job.rockstar">
            {{ scInfo.platformName }} ·
          </template>
          <template v-if="job.minPl === job.maxPl">Only for</template>
          <template v-else>{{ job.minPl || 1 }}-</template>{{ job.maxPl }} players ·
          {{ updatedDate }}
          <!-- <br>Points: {{ job.stats.points }} -->
        </div>
        <div>
          {{ jobExt.scModeName || jobExt.scTypeName }} within the game
        </div>
      </div>
      <br>

      <div
        class="card__footer field is-grouped is-grouped-multiline"
        title="Click here to see different stats"
        @click="primaryInfo = !primaryInfo"
      >
        <div class="control">
          <div
            class="tags has-addons"
            :class="{ tooltip: !primaryInfo }"
            data-tooltip="R* also takes into account unfinished jobs">
            <span
              class="tag is-rounded is-medium"
              :class="ratingCssClass(job.stats.ratingQuit)">
              <span class="icon">
                <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
              </span>
              <span v-if="primaryInfo">{{ job.stats.likes | formatNumber }}</span>
              <span v-else>{{ job.stats.rating + '%' }}</span>
            </span>
            <span class="tag is-light is-rounded is-medium has-text-grey-light">
              <span
                v-if="primaryInfo"
                class="icon"
              >
                <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
              </span>
              <span v-if="primaryInfo">{{ job.stats.dislikes | formatNumber }}</span>
              <span v-else>R*: {{ job.stats.ratingQuit + '%' }}</span>
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
            <span v-if="primaryInfo">{{ job.stats.playTot | formatNumber }}</span>
            <span v-else>{{ job.stats.playUnq | formatNumber }}</span>
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

    recentlyAdded() {
      return new Date() - new Date(this.job.scAdded)
        <= 1000 * 60 * 60 * 24 * 14;
    },

    avatars() {
      return userAvatars(this.job.author);
    },

    updatedDate() {
      const { ver } = this.job;
      return updatedDate({ date: this.job.scUpdated, ver });
    },

    scInfo() {
      const { scType, scMode, platform } = this.job;
      // { scTypeName, scTypeIcon, scModeName, platformName }
      return {
        ...scTypeModeIcon({ scType, scMode }),
        ...scPlatformName({ platform })
      };
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
}
</style>
