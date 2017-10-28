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

    <jobtype-box
      v-if="type && modes[type - 1].image"
      :background="modes[type - 1].image"
      :text="modes[type - 1].name">
    </jobtype-box>

    <div class="field">
    <div class="dropdown" id="dropdown">
      <div class="dropdown-trigger">
        <button class="button" @click="onDropdown">
          <span>Job type</span>
          <span class="icon is-small">
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a class="dropdown-item" v-for="(item, i) in modes" :key="i">
            <icon-gta :icon="item.icon"></icon-gta>
              {{ item.name }}
          </a>
        </div>
      </div>
    </div>
    </div>


    <template v-if="type">
    <div class="field is-grouped is-grouped-multiline">
      <p
        class="control"
        v-for="(item, i) in modes[type - 1].modes"
        :key="i">
          <span class="tags has-addons">
            <router-link
              class="tag is-rounded"
              :class="{ 'is-primary': i + 1 === mode }"
              :to="{ path: '/', query: genQuery({ mode: i + 1 }) }">
              <icon-gta :icon="item.icon"></icon-gta>
              {{ item.name }}
            </router-link>
            <a
              v-if="i + 1 === mode"
              class="tag is-delete is-rounded"></a>
          </span>
      </p>
    </div>
    </template>
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
