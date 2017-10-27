<template>
  <div>
    <div class="title is-5">Type</div>
    <aside class="menu">
      <ul class="menu-list">
        <li><a>Any</a></li>
        <li v-for="(item, i) in modes" :key="i">
        <router-link
          :class="{ 'is-active': i + 1 === type }"
          :to="{ path: '/', query: genQuery({ type: i + 1, mode: 0 }) }">
              <span
                class="icon"
                style="font-family: 'gtav-icon-font';"
                v-html="'&#x' + item.icon + ';'"
                ></span>
              {{ item.name }}
            </span>
        </router-link>
      </li>
      </ul>
    </aside>

    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="(item, i) in modes" :key="i">
        <router-link
          class="control"
          :to="{ path: '/', query: genQuery({ type: i + 1, mode: 0 }) }">
          <div class="tags has-addons">
            <span
              class="tag is-medium"
              :class="{ 'is-primary': i + 1 === type }">
              <span
                class="icon"
                style="font-family: 'gtav-icon-font';"
                v-html="'&#x' + item.icon + ';'"
                ></span>
              {{ item.name }}
            </span>
            <a class="tag is-medium is-delete" v-if="i + 1 === type"></a>
          </div>
        </router-link>
      </div>
    </div>

    <template v-if="type">
      <div class="title is-5">Mode</div>

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
                  class="tag"
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

export default {
   props: [
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ],

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
