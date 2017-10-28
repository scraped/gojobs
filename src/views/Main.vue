<template>
  <section class="section">
    <div class="container">
      <!-- <div class="tabs">
      <ul>
        <li class="is-active"><a>Members — PC</a></li>
        <li
          v-if="author"
          class="is-active">
          <a>@{{ author }}</a>
        </li>
        <li><a>Rockstar</a></li>
        <li><a>R* Verified</a></li>
      </ul>
    </div> -->
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-widescreen is-one-third-desktop is-one-third-tablet">
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
  </section>
</template>

<script>
import SearchJobs from '../components/main/SearchJobs.vue';
import JobsList from '../components/main/JobsList.vue';

export default {
  components: {
    SearchJobs,
    JobsList
  },

  props: [
    'page',
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ]
};
</script>
