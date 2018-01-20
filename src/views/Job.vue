<template>
  <div>
    <bulma-hero
      class="is-medium"
      :background="job.image"
      :text="job.name">
    </bulma-hero>

    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <div class="box">
              <p v-html="job.desc"></p>

              <br>
              <figure>
                <img :src="job.image" :alt="job.name">
              </figure>

              <br>
              <div class="tags">
                <span
                  :class="`tag is-${ratingCssClass} is-rounded is-medium`">
                  <span class="icon">
                    <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.likes | formatNumber }}</span></span>
                <span class="tag is-rounded is-medium">
                  <span class="icon">
                    <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.dislikes | formatNumber }}</span></span>
                <span
                  class="tag is-light is-rounded is-medium tooltip"
                  data-tooltip="Launches">
                  <span class="icon">
                    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.playTot | formatNumber }}</span></span>
                <span
                  class="span tag is-rounded is-medium tooltip"
                  data-tooltip="People played this">
                  <span class="icon">
                    <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.playUnq | formatNumber }}</span></span>
              </div>

              <div class="has-text-grey">
                {{ platforms[job.platform - 1].name }} · {{ job.job.maxpl }} players
              </div>
            </div>
          </div>

          <div class="column is-one-third-widescreen is-two-fifths-desktop is-12-tablet">
            <div class="box">
              <div class="label">Author</div>
              <div class="media">
                <div class="media-left">
                  <figure class="image image-avatar is-48x48">
                    <img class="is-rounded" :src="job.author.avatar.small">
                  </figure>
                </div>

                <div class="media-content">
                  <p class="subtitle is-6">
                    @{{ job.author.username }}
                    <span
                      class="tag is-white"
                      :style="`border: 1px solid #${job.crew.color}`"
                      v-if="job.crew">{{ job.crew.tag }}</span>
                    <br>
                    <span v-if="job.crew.name" class="has-text-grey">
                      {{ job.crew.name }}
                    </span>
                  </p>
                </div>
              </div>

              <br>
              <div class="label">Actual rating</div>
              <!-- <div class="has-text-grey-light is-size-7">
                This rating doesn't consider quits and based only on the actual likes and dislikes.
              </div> -->
              <div>{{ job.stats.rating }}%</div>

              <br>
              <div class="label">RGSC rating</div>
              <div>
                {{ job.stats.ratingQuit }}%
                <span class="has-text-grey">
                  (diff: {{ job.stats.rating - job.stats.ratingQuit }}%)
                </span>
              </div>

              <br>
              <div class="label">Updated</div>
              <div>{{ job.dates.updated | formatDate }} (version {{ job.ver }})</div>

              <template v-if="job.dates.added">
                <br>
                <div class="label">Added</div>
                <div>{{ job.dates.added | formatDate }}</div>
              </template>

              <br>
              <div class="label">Information updated</div>
              <div>{{ job.dates.fetch | formatDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

import BulmaHero from 'src/components/BulmaHero.vue';
import IconGta from 'src/components/IconGta.vue';

export default {
  fetchData({ store, route }) {
    return store.dispatch('job/fetch', route.params);
  },

  components: {
    BulmaHero,
    IconGta
  },

  computed: {
    ...mapState('job', {
      job: state => state.job
    }),
    ...mapState('common', {
      modes: state => state.modes,
      platforms: state => state.platforms
    }),

    ratingCssClass() {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    }
  }
}
</script>
