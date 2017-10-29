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

    <div class="field">
      <div class="dropdown-content">
        <span class="dropdown-item">
          <div class="label">
            Type<a class="button is-danger is-outlined is-small is-pulled-right">Reset</a>
          </div>
        </span>
        <jobtype-box
          v-if="type && modes[type - 1].image"
          :background="modes[type - 1].image"
          :text="modes[type - 1].name">
        </jobtype-box>

        <template v-for="(typeInfo, i) in modes">
          <router-link
            :to="{ path: '/', query: genQuery({ type: i + 1 }) }"
            class="dropdown-item"
            :class="{ 'is-active': type === i + 1 }"
            :key="i">
              <icon-gta :icon="typeInfo.icon"></icon-gta>
              {{ typeInfo.name }}
          </router-link>

          <span
            v-if="type && type === i + 1"
            class="dropdown-item"
            :key="-i">
            <div class="field is-grouped is-grouped-multiline">
              <p
                class="control"
                v-for="(modeInfo, j) in modes[type - 1].modes"
                :key="j">
                <span class="tags has-addons">
                  <router-link
                    :to="{ path: '/', query: genQuery({ mode: j + 1 }) }"
                    class="tag is-rounded"
                    :class="{ 'is-primary': mode === j + 1 }">
                    <icon-gta :icon="modeInfo.icon"></icon-gta>
                    {{ modeInfo.name }}
                  </router-link>
                  <a
                    v-if="j + 1 === mode"
                    class="tag is-delete is-rounded"></a>
                </span>
              </p>
            </div>
          </span>
        </template>
      </div>
    </div>

    <div class="field">
      <div class="dropdown-content">
        <span class="dropdown-item">
          <div class="label">Amount of players</div>
        </span>

        <span class="dropdown-item">
          ewfwf
        </span>
      </div>
    </div>

    <div class="field">
      <div class="label">Platform<div class="tags is-pulled-right">
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
