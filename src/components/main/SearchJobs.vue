<template>
  <div>
    <div class="field" v-if="author">
      <div class="label">Author</div>
      <div class="notification is-light">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48 media-left-avatar">
            <img :src="'https://a.rsg.sc/n/' + author.toLowerCase() + '/l'">
          </figure>
        </div>

        <div class="media-content">
          <h2 class="subtitle is-5">{{ author }}</h2>
        </div>
      </div>
      </div>
    </div>

    <!-- <div class="field">
    <div class="columns is-multiline is-gapless">
      <div
        class="column is-3 has-text-centered"
        v-for="(item, i) in modes" :key="i">
          <a class="button is-white" style="border-radius: 100%;">
          <span
            class="icon"
            style="font-family: 'gtav-icon-font'; font-size: 24px;"
            v-html="'&#x' + item.icon + ';'"
            ></span>
          </a>
      </div>
    </div>
    </div> -->

    <jobtype-box
      v-if="type && modes[type - 1].image"
      :background="modes[type - 1].image"
      :textd="modes[type - 1].name">
    </jobtype-box>

    <div class="tags">
      <router-link
        class="tag is-medium is-light is-rounded"
        v-for="(item, i) in modes" :key="i"
        :to="{ path: '/', query: genQuery({ type: i + 1, mode: 0 }) }">
        <span
          class="icon"
          style="font-family: 'gtav-icon-font'; color: #EB0000;"
          v-html="'&#x' + item.icon + ';'"
          ></span>
        {{ item.name }}
      </router-link>
    </div>

    <template v-if="type">
    <div class="label">Mode</div>
    <div class="field is-grouped is-grouped-multiline">
      <div
        class="control"
        v-for="(item, i) in modes[type - 1].modes"
        :key="i">
          <router-link
            class="control"
            :to="{ path: '/', query: genQuery({ mode: i + 1 }) }">
            <div class="tags has-addons">
              <span
                class="tag is-rounded"
                :class="{ 'is-primary': i + 1 === mode }"
                :key="i">
                <span
                  class="icon"
                  style="font-family: 'gtav-icon-font';"
                  v-html="'&#x' + item.icon + ';'"
                  ></span>
                {{ item.name }}
              </span>
            </div>
          </router-link>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import modes from '../../../config/modes';
import JobtypeBox from './JobtypeBox.vue';

export default {
   props: [
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ],

  components: {
    JobtypeBox
  },

  data () {
    return {
      modes
    }
  },

  methods: {
    genQuery (obj) {
      return Object.assign({}, this.$route.query, obj);
    }
  }
}
</script>

<style>

</style>
