<template>
  <section class="hero is-fullheight">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        {{ errorCode }}
      </h1>
      <h2 class="subtitle">
        {{ errorName }}
      </h2>
    </div>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {
      errorCode: this.$route.params.code
    };
  },

  computed: {
    errorName() {
      const commonErrors = {
        404: 'Page Not Found',
        500: 'Internal Server Error'
      };

      return commonErrors[this.errorCode] || 'An error occured.';
    }
  }
}
</script>
