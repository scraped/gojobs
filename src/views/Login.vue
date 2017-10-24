<template>
  <div class="container">
    You can sign up or log in here:
    <router-link :to="{ path: '/login/signin' }">Sign In</router-link>,
    <router-link :to="{ path: '/login/signup' }">Sign Up</router-link>
    <br>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
