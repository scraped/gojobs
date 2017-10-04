<template>
  <h1>{{ message }}</h1>
</template>

<script>
export default {
  data:  function() {
    return {
      message: 'Hello vuorld!'
    };
  }
};
</script>

<style scoped>
  h1 {
    color: blueviolet;
  }
</style>
