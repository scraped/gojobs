<template>
  <div>
    <div class="field" v-if="author">
      <div class="dropdown-content">
        <span class="dropdown-item">
          <div class="label">
            Author<a class="button is-danger is-outlined is-small is-pulled-right">Reset</a>
          </div>
        </span>
        <div class="notification is-light">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48 media-left-avatar">
                <img :src="'https://a.rsg.sc/n/' + author.toLowerCase() + '/l'">
              </figure>
            </div>

            <div class="media-content">
              <h2 class="subtitle is-5">@{{ author }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <aside class="menu">
      <template v-for="(typeInfo, i) in modes">
      <p class="menu-label" :key="i">
        {{ typeInfo.name }}
      </p>
      <div class="tags">
        <span
          class="tag"
          :class="{ 'is-light': mode === j + 1 }"
          v-for="(modeInfo, i) in modes[i].modes" :key="j">
          {{ modeInfo.name }}
        </span>
      </div>
      </template>
    </aside>

    <div class="field">
      <div class="subtitle">Creator</div>
      <div class="dropdown-content">
        <a class="dropdown-item is-selected">Members</a>
        <a class="dropdown-item">Rockstar</a>
        <a class="dropdown-item">R* Verified</a>
      </div>
    </div>

    <div class="field">
        <div class="subtitle">Type</div>
        <!-- <jobtype-box
          v-if="type && modes[type - 1].image"
          :background="modes[type - 1].image"
          :text="modes[type - 1].name">
        </jobtype-box> -->

          <div class="tags">
            <span
              class="tag is-small is-text"
              :class="{ 'is-light': type === i + 1 }"
              v-for="(typeInfo, i) in modes" :key="i">
                {{ typeInfo.name }}
              </span>
          </div>
    </div>

    <div class="field">
      <div class="subtitle">Players</div>
    </div>

    <div class="field">
      <div class="subtitle">Platform<div class="tags is-pulled-right">
        <span class="tag is-rounded is-dark">PC</span>
        <span class="tag is-rounded">PS4</span>
        <span class="tag is-rounded">Xbox One</span>
      </div></div>
    </div>
  </div>
</template>

<script>
import modes from '../../../config/modes';
import JobtypeBox from './JobtypeBox.vue';
import IconGta from '../IconGta.vue';

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
    JobtypeBox,
    IconGta
  },

  data () {
    return {
      modes
    }
  },

  methods: {
    genQuery (obj) {
      return Object.assign({}, this.$route.query, obj);
    },

    onDropdown (e) {
      document.getElementById('dropdown').classList.toggle('is-active');
    }
  }
}
</script>

<style>
</style>
