<template>
  <card>
    <card-image>
      <div class="rating-strip"></div>
      <div class="name">
        <b-title is-5 v-html="job.name"></b-title>
      </div>
      <b-image is-2by1>
        <img :src="image" :title="job.name" width="200" height="300">
      </b-image>
    </card-image>

    <card-content>
      <media>
        <media-left>
          <b-image image-avatar is-48x48>
            <img :src="avatar" class="avatar">
          </b-image>
        </media-left>

        <media-content>
          <subtitle is-6>
            <a href="">@{{ job.author.username }}</a>
            <tag is-white style="border: 1px solid #f892da">{{ job.author.crew.tag }}</tag>
          </subtitle>
        </media-content>

        <media-right>
          <div class="icon">ICON</div>
        </media-right>
      </media>

      <tags>
        <tag>Up to 30 players</tag>
      </tags>
    </card-content>

    <card-footer>
      <card-footer-item>
        Сыграно
      </card-footer-item>
      <card-footer-item>
        Лайки
      </card-footer-item>
    </card-footer>
  </card>
</template>

<script>
import { bulmaComponentGenerator } from 'vue-bulma-components';

export default {
  name: 'card-job',

  components: {
    'tags': bulmaComponentGenerator('tags'),
  },

  props: ['jobObj'],

  data () {
    return {
      job: this.jobObj,
      image: `https://prod.cloud.rockstargames.com/ugc/gta5mission/${this.jobObj.img.split('.')[0]}/${this.jobObj.jobCurrId}/${this.jobObj.img.split('.')[1]}.jpg`,
      avatar: 'https://a.rsg.sc/n/' + this.jobObj.author.username.toLowerCase() + '/s'
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
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

.avatar {
  border-radius: 100%;
  width: 48px;
  height: 48px;
}
</style>
