<template>
  <div class="box">
    <form
      method="post"
      @submit.prevent="upload">
      <h2 class="subtitle is-4">Upload fetched jobs</h2>
      <div class="field">
        <b-checkbox v-model="forceUploadAll">
          Force to upload all jobs (not only new ones)
        </b-checkbox>
      </div>

      <b-message
        v-if="forceUploadAll"
        type="is-warning">
        <b>Warning:</b> this can take A LOT of time.
      </b-message>

      <button class="button is-primary">
        Upload
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forceUploadAll: false
    }
  },

  methods: {
    async upload() {
      const { forceUploadAll } = this;

      await this.$http.post('/api/job/upload', {
        uploadAll: Number(forceUploadAll)
      });
    }
  }
};
</script>
