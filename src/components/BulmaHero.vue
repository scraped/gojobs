<template>
  <div class="hero is-medium" :style="`background-image: url(${background});`">
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

<<style lang="scss">
@import "@bulma/layout/hero";
</style>
