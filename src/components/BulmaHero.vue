<template>
  <div class="hero">
    <div
      class="hero-background"
      :style="`background-image: url(${background});`"></div>
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-white" v-html="text"></h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: 'https://pp.userapi.com/c637620/v637620124/4ea6b/epGeW29ZU98.jpg'
    },

    text: {
      type: String,
      default: ''
    }
  }
}
</script>


<style lang="scss">
@import "../scss/utilities/_all";
@import "../scss/layout/hero";
@import "../scss/vars";

.hero {
  position: relative;
  // background: $main-gradient-light;
}

.hero-background {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: 35%;
}
</style>
