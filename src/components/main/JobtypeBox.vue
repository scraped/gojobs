<template>
  <div
    class="notification notification-box is-black"
    :style="`background-image: url(${background})`">
    <h2 class="subtitle is-2">{{ text }}</h2>
  </div>
</template>

<script>
export default {
  props: ['background', 'text']
}
</script>

<style lang="scss">
  .notification {
    padding-top: 2em;
    padding-bottom: 2em;
  }
  .notification-box {
    background-size: cover;
    background-position: 50% 50%;
    h2 {
      font-family: 'SignPainter-HouseScript';
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.75);
    }
  }
</style>
