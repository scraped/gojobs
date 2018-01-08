<template>
  <div>
    <bulma-hero class="is-medium" text="GTA Online Jobs"></bulma-hero>

    <section class="section">
      <div class="container">
        <jobs-list></jobs-list>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import BulmaHero from '@components/BulmaHero.vue';
import JobsList from '@components/JobList.vue';

export default {
  components: {
    BulmaHero,
    JobsList
  }
};
</script>
