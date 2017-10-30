<template>
  <div>
    <!-- <div class="hero is-dark" style="background: url(https://pp.userapi.com/c638016/v638016124/4598e/3FBhzHDXPyw.jpg) 50% 20%;">
      <div class="hero-body">
        <div class="container">
          <h1 style="font-family: 'SignPainter-HouseScript';font-size: 50px;">Races</h1>
          <div class="buttons">
            <router-link
              v-for="(typeInfo, i) in modes"
              :key="i"
              :to="{ path: '/', query: genQuery({ type: i + 1}) }"
              class="button is-dark is-outlined tooltip"
              :class="{ 'is-dark': type === i + 1 }"
              style="border-radius: 100%; margin: 0 0.1rem; background: transparent;"
              :data-tooltip="typeInfo.name">
              <icon-gta :icon="typeInfo.icon"></icon-gta>
            </router-link>
          </div>
        </div>
      </div>
    </div> -->
  <div class="container">
    <!-- <search-jobs
      :author="author"
      :crew="crew"
      :platform="platform"
      :type="type"
      :mode="mode"
      :maxpl="maxpl"></search-jobs> -->
    <!-- <br> -->

    <jobs-list
      :page="page"
      :crew="crew"
      :author="author"
      :platform="platform"
      :type="type"
      :mode="mode"
      :maxpl="maxpl"></jobs-list>
  </div>
  </div>
</template>

<script>
import modes from '../../config/modes';
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';
import IconGta from '../components/IconGta.vue';

export default {
  components: {
    SearchJobs,
    JobsList,
    IconGta
  },

  props: [
    'page',
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
    },
  }
};
</script>
