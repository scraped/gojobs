<template>
  <div class="card">
    <div class="card-image">
      <div class="card-strip"></div>
      <div class="card-title">
        <div class="title is-5">
          <span class="tooltip" :data-tooltip="'Mode: ' + job.job.mode.name">
          <span
            class="icon tooltip"
            style="font-family: 'gtav-icon-font';"
            v-html="'&#x' + job.job.mode.icon + ';'"
            ></span>
          </span>
          <span v-html="job.name"></span>
        </div>
      </div>
      <div class="image is-2by1">
        <img :src="job.image" :title="job.name">
      </div>
    </div>

    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48 media-left-avatar">
            <img :src="job.author.avatar.small">
          </figure>
        </div>

        <div class="media-content">
          <p class="subtitle is-6">
            <a href="">@{{ job.author.username }}</a>
            <span class="tag is-white"
              :style="'border: 1px solid #' + job.author.crew.color"
              v-if="job.author.crew">
              {{ job.author.crew.tag }}</span><br>
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
      <div class="card-footer-item">
        <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
        {{ job.stats.pldTot | formatNumber }}</div>
      <div class="card-footer-item">
        <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
        {{ job.stats.likes | formatNumber }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import modes from '../../config/modes';

export default {
  name: 'card-job',

  props: ['jobObj'],

  data () {
    return {
      job: this.jobObj,
      dateReadable: this.getDateReadable()
    };
  },

  filters: {
    formatNumber (num) {
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
      if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
      return num;
    }
  },

  methods: {
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
// TO REMOVE!!!!!!!!!!!!!!
.fa {
  padding: 5px;
}
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

}

.media-left-avatar {
  img {
    border-radius: 100%;
  }
}

.subtitle-date {
  margin-top: 2px;
  font-size: 0.9em;
  font-style: italic;
}
</style>
