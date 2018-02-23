<template>
  <div>
  <div class="hero is-medium" :style="`background-image: url(${background});`">
    <div class="hero-body">
      <div class="container">
        <!-- <h1 class="title has-text-white" v-html="text"></h1> -->
      </div>
    </div>
  </div>
  <!-- <div class="hero is-white a">
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-dark">
          <span v-html="text"></span>
        </h1>
      </div>
    </div>
  </div> -->
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

<style lang="scss" scoped>
.hero.is-medium {
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: #363636;
}

.a {
  background: #afdafc;
  span {
    border-bottom: 5px solid #363636;
  }
}
</style>

