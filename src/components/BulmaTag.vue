<template>
  <span class="tag is-rounded is-medium">
    <slot></slot>
  </span>
</template>

<style lang="scss">
@import "../scss/bulma/utilities/_all";

$tag-background-color: $grey-lighter;
$tag-color: $grey-dark;

@import "../scss/bulma/elements/tag";
</style>
