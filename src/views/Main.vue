<template>
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-widescreen is-one-third-desktop">
          <search-jobs
            :author="author"
            :crew="crew"
            :platform="platform"
            :type="type"
            :mode="mode"
            :maxpl="maxpl"></search-jobs>
        </div>

        <div class="column">
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
};
</script>
