<template>
  <div class="tabs">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<style lang="scss">
.tabs li:not(:first-of-type) {
  margin-left: 1em;
}
</style>
