<template>
  <span class="button is-rounded is-small">
    <slot></slot>
  </span>
</template>

<style lang="scss">
@import "../scss/utilities/_all";

$tag-background-color: $grey-lighter;
$tag-color: $grey-dark;

@import "../scss/elements/tag";
</style>
