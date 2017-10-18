<template>
  <b-card>
    <b-card-image>
      <div class="card-strip"></div>
      <div class="card-title">
        <b-b-title is-5 v-html="job.name"></b-b-title>
      </div>
      <b-b-image is-2by1>
        <img :src="image" :title="job.name" width="200" height="300">
      </b-b-image>
    </b-card-image>

    <b-card-content>
      <b-media>
        <b-media-left>
          <figure class="image is-48x48 media-left-avatar">
            <img :src="authorAvatar">
          </figure>
        </b-media-left>

        <b-media-content>
          <b-subtitle is-6>
            <a href="">@{{ job.author.username }}</a>
            <b-tag
              is-white
              :style="'border: 1px solid #' + job.author.crew.color">
              {{ job.author.crew.tag }}</b-tag>
          </b-subtitle>
        </b-media-content>

        <b-media-right>
          <div class="icon">ICON</div>
        </b-media-right>
      </b-media>

      <b-tags>
        <b-tag>{{ job.job.maxpl }} players</b-tag>
      </b-tags>
    </b-card-content>

    <b-card-footer>
      <b-card-footer-item>
        <i class="fa fa-gamepad fa-lg" aria-hidden="true"></i>
        {{ job.stats.pldTot | formatNumber }}</b-card-footer-item>
      <b-card-footer-item>
        <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
        {{ job.stats.likes | formatNumber }}</b-card-footer-item>
    </b-card-footer>
  </b-card>
</template>

<script>
import { bulmaComponentGenerator } from 'vue-bulma-components';

export default {
  name: 'card-job',

  components: {
    'b-tags': bulmaComponentGenerator('tags'),
  },

  props: ['jobObj'],

  data () {
    return {
      job: this.jobObj,
      image: this.getImage(),
      authorAvatar: this.getAuthorAvatar()
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
    getImage () {
      let img = this.jobObj.img.split('.');
      let id = this.jobObj.jobCurrId;
      return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${id}/${img[1]}.jpg`;
    },

    getAuthorAvatar () {
      let username = this.jobObj.author.username.toLowerCase();
      return `https://a.rsg.sc/n/${username}/s`;
    }
  }
};
</script>

<style lang="scss">
// TO REMOVE!!!!!!!!!!!!!!
.fa {
  padding: 5px;
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
    color: #ffffff;
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
</style>
