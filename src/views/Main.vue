<template>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-desktop">
          <div class="title is-5">Type</div>
          <div class="field is-grouped is-grouped-multiline">
            <div class="control" v-for="(mode, i) in modes" :key="i">
              <router-link
                class="control"
                :to="{ path: '/', query: { mode: i + 1 } }">
                <div class="tags has-addons">
                  <span
                    class="tag is-medium"
                    :class="{ 'is-primary': i + 1 === modeId }">
                    <span
                      class="icon"
                      style="font-family: 'gtav-icon-font';"
                      v-html="'&#x' + mode.icon + ';'"
                      ></span>
                    {{ mode.name }}
                  </span>
                  <a class="tag is-medium is-delete" v-if="i + 1 === modeId"></a>
                </div>
              </router-link>
            </div>
          </div>

          <template v-if="modeId">
            <div class="title is-5">Mode</div>
            <div class="tags" v-if="modeId">
              <span
                class="tag"
                v-for="(mode, i) in modes[modeId - 1].modes"
                :key="i">
                <span
                  class="icon"
                  style="font-family: 'gtav-icon-font';"
                  v-html="'&#x' + mode.icon + ';'"
                  ></span>
                {{ mode.name }}
              </span>
            </div>
          </template>
        </div>
        <div class="column">
          <jobs-list :page="page"></jobs-list>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import modes from "../../config/modes";
import JobsList from '../components/JobsList.vue';

export default {
  components: {
    JobsList
  },

  watch: {
    '$route': 'onRouteUpdate'
  },

  data() {
    return {
      modes: modes,
      page: 1,
      modeId: 0
    };
  },

  created () {
    this.onRouteUpdate();
  },

  methods: {
    onRouteUpdate () {
      this.page = Number(this.$route.query.page);
      this.modeId = Number(this.$route.query.mode);
    }
  }
};
</script>
