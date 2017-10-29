<template>
  <div>
    <div class="dropdown-content" v-if="author">
      <span class="dropdown-item">
      <div class="label">Author
        <a class="button is-danger is-outlined is-small is-pulled-right">Reset</a>
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



    <div class="field">
      <div class="dropdown-content">
        <span class="dropdown-item">
          <div class="label">Type
            <a class="button is-danger is-outlined is-small is-pulled-right">Reset</a>
          </div>
        </span>
        <jobtype-box
          v-if="type && modes[type - 1].image"
          :background="modes[type - 1].image"
          :text="modes[type - 1].name">
        </jobtype-box>
        <template
          v-for="(item, i) in modes">
          <router-link
            :to="{ path: '/', query: genQuery({ type: i + 1 }) }"
            :class="{ 'is-active': i + 1 === type }"
            class="dropdown-item"
            :key="i">
              <icon-gta :icon="item.icon"></icon-gta>
              {{ item.name }}
          </router-link>

          <span
            class="dropdown-item"
            v-if="type && i + 1 === type"
            :key="i">
            <div
              class="field is-grouped is-grouped-multiline"
              :key="i">
              <p
                class="control"
                v-for="(item2, j) in modes[type - 1].modes"
                :key="j">
                  <span class="tags has-addons">
                    <router-link
                      class="tag is-rounded"
                      :class="{ 'is-primary': j + 1 === mode }"
                      :to="{ path: '/', query: genQuery({ mode: j + 1 }) }">
                      <icon-gta :icon="item2.icon"></icon-gta>
                      {{ item2.name }}
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
