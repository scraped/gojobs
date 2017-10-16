<template>
  <card>
    <card-image>
      <b-title is-5>name: <span v-html="job.name"></span></b-title>
      <!-- <card-image-text></card-image-text> -->
      <!-- <card-image-strip></card-image-strip> -->
      <b-image is-2by1>
        <img :src="job.imageUrl" :title="job.name" width="200" height="300">
      </b-image>
    </card-image>

    <card-content>
      <media>
        <media-left>
          <b-image image-avatar is-48x48>
            <img src="https://a.rsg.sc/n/rockstar/s">
          </b-image>
        </media-left>

        <media-content>
          <subtitle is-6>
            <a href="">@andreww2012</a>
            <tag is-white style="border: 1px solid #f892da">ZARU</tag>
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
      job: this.jobObj
    };
  }
};
</script>

<style>

</style>
