<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <div class="box">
              <div>
                <span class="title" v-html="job.name"></span>
                <span class="icon is-medium has-text-warning tooltip" data-tooltip="Editor's choice">
                  <i class="fa fa-star fa-lg" aria-hidden="true"></i>
                </span>
              </div>
              <br>
              <figure>
                <img :src="job.image" :alt="job.name">
              </figure>
              <br>
              <p v-html="job.desc"></p>
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
                {{ platforms[job.platform - 1].name }} · {{ job.job.maxpl }} players · {{ dateReadable }}
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
              <div>{{ job.stats.ratingQuit }}%</div>

              <br>
              <div class="label">Platform</div>
              <div>{{ platforms[job.platform - 1].name }}</div>

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
import store from '../store';
import modes from '../../config/modes';
import platforms from '../../config/platforms';
import IconGta from '../components/IconGta.vue';

export default {
  components: {
    IconGta
  },

  data() {
    return {
      modes,
      platforms
    }
  },

  computed: {
    job() {
      return this.$store.state.job.job;
    },

    ratingCssClass() {
      let rating = this.job.stats.ratingQuit;
      return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
    },

    dateReadable() {
      let job = this.job;
      let dateString = moment(job.dates.updated).fromNow();
      if (job.ver === 1) {
        return `added ${dateString}`;
      } else {
        return `${dateString} (version ${job.ver})`;
      }
    }
  },

  async beforeRouteEnter(to, from, next) {
    await store.dispatch('job/fetch', { id: to.params.id });
    next();
  },

  async beforeRouteUpdate(to, from, next) {
    await store.dispatch('job/fetch', { id: to.params.id });
    next();
  },

  filters: {
    formatNumber(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
      if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
      return num;
    }
  },
}
</script>

<style>
.agile__dot button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 100%;
  border: 0;
  font-size: 0;
}
</style>
