<template>
  <!-- <div class="columns">
      <div v-if="author" class="column is-3">
        <div class="box">
          <div class="subtitle">Author</div>
          <div class="dropdown-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48 media-left-avatar">
                    <img class="is-rounded" :src="'https://a.rsg.sc/n/' + author.toLowerCase() + '/l'">
                  </figure>
                </div>

                <div class="media-content">
                  <h2 class="subtitle is-6">@{{ author }}</h2>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="box">
          <div class="subtitle">Game mode<template v-if="type">: {{ modes[type - 1].name }}
            </template>
          </div>
          <div class="buttons">
            <router-link
              v-for="(typeInfo, i) in modes"
              :key="i"
              :to="{ path: '/', query: genQuery({ type: i + 1}) }"
              class="button is-white tooltip"
              :class="{ 'is-dark': type === i + 1 }"
              style="margin: 0 0.1rem;"
              :data-tooltip="typeInfo.name">
              <icon-gta :icon="typeInfo.icon"></icon-gta>
              <span v-if="type === i + 1">{{ modes[type - 1].name }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="type && modes[type - 1]" class="column is-3">
        <div class="box">
          <div class="tags">
            <router-link
              v-for="(modeInfo, i) in modes[type - 1].modes"
              :key="i"
              :to="{ path: '/', query: genQuery({ mode: i + 1 }) }"
              class="tag"
              :class="{ 'is-primary': mode === i + 1 }">
              <icon-gta :icon="modeInfo.icon"></icon-gta>
              {{ modeInfo.name }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="box">
          <div class="subtitle">Players</div>
          <div class="tags">
            <span class="tag">8-</span>
            <span class="tag">16-</span>
            <span class="tag">30-</span>
          </div>
        </div>
      </div>
  </div> -->
  <div>
    <div class="box">
      <div class="subtitle" id="mode">
        Mode
      </div>
      <span
        v-for="(typeInfo, i) in modes"
        :key="i">
          <div class="label">
            <icon-gta :icon="typeInfo.icon"></icon-gta> {{ typeInfo.name }}
          </div>
          <div class="tags">
            <span class="tag"
              v-for="(tagInfo, j) in modes[i].flags"
              :key="j"
              :style="`background: #${tagInfo.color};`">
                {{ tagInfo.name }}
            </span>
          </div>
      </span>
      <!-- <div
        class="tags"
        v-if="type">
          <span class="tag"
            v-for="(tagInfo, j) in modes[type - 1].flags"
            :key="j"
            :style="`background: #${tagInfo.color};`">
              {{ tagInfo.name }}
          </span>
      </div> -->
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
      modes,
      type: Number(this.$route.query.type)
    }
  },

  created () {
    console.log(Number(this.type))
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
