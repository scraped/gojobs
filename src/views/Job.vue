<template>
  <div>
    <!-- <div class="hero is-dark">
      <div class="hero-body">
        <h1 class="subtitle has-text-centered">No images</h1>
      </div>
    </div>
    <br> -->

    <section class="section">
      <div class="container">
          <div class="columns is-multiline">
            <div class="column has-text-centered is-one-third-widescreen is-two-fifths-desktop is-12-tablet">
              <figure class="image is-2by1">
                <img :src="job.image" :alt="job.name">
              </figure>
            </div>
            <div class="column">
              <div class="box">
                <div>
                  <span class="title" v-html="job.name"></span>
                  <span class="icon is-medium has-text-warning tooltip" data-tooltip="Editor's choose">
                    <i class="fa fa-star fa-lg" aria-hidden="true"></i>
                  </span>
                </div>
                <br>
                <p v-html="job.desc"></p>
                <br>

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
                        class="tag is-white tooltip is-tooltip-right"
                        :style="'border: 1px solid #' + job.crew.color"
                        v-if="job.crew"
                        :data-tooltip="job.crew.name ? job.crew.name : '<Name not loaded>'">
                        {{ job.crew.tag }}</span>
                        <br>
                    </p>
                  </div>
      </div>

                <br>
                <div class="has-text-grey">
                  {{ platforms[job.platform - 1].name }} · {{ job.job.maxpl }} players · {{ dateReadable }}
                </div>

                <br>
                <div class="field is-grouped is-grouped-multiline">
                  <div class="control">
                    <div class="tags has-addons">
                      <span class="tag is-medium is-rounded has-text-grey-light is-dark">Type</span>
                      <span class="tag is-medium is-rounded is-primary">{{ modes[job.job.gameType - 1].name }}</span>
                    </div>
                  </div>

                  <div class="control">
                    <div class="tags has-addons">
                      <span class="tag is-medium is-rounded has-text-grey-light is-dark">Mode in game</span>
                      <span class="tag is-medium is-rounded is-primary"><icon-gta :icon="modes[job.job.gameType - 1].modes[job.job.gameMode - 1].icon"></icon-gta> <span>{{ modes[job.job.gameType - 1].modes[job.job.gameMode - 1].name }}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-multilime">
          <div class="column is-one-third">
            <div class="box">
              <h2 class="title is-6">Statistics</h2>
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
                  <span>{{ job.stats.dlikes | formatNumber }}</span></span>
                <span
                  class="tag is-light is-rounded is-medium tooltip"
                  data-tooltip="Launches">
                  <span class="icon">
                    <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.pldTot | formatNumber }}</span></span>
                <span
                  class="span tag is-rounded is-medium tooltip"
                  data-tooltip="People played this">
                  <span class="icon">
                    <i class="fa fa-users fa-lg" aria-hidden="true"></i>
                  </span>
                  <span>{{ job.stats.pldUnq | formatNumber }}</span></span>
              </div>
              <h2 class="label">
                Real rating & optimal rating<br>
                <span class="has-text-grey-light is-size-7">Optimal rating considers the quits.</span>
              </h2>
              <p>{{ job.stats.rating }}% ({{ job.stats.ratingQuit }}%)</p><br>
              <h2 class="label">Platform</h2>
              <p>{{ platforms[job.platform - 1].name }}</p>
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
      let dateString = moment(job.updated.job).fromNow();
      if (job.category || job.updated.ver === 1) {
        return `added ${dateString}`;
      } else {
        return `${dateString} (version ${job.updated.ver})`;
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
