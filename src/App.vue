<template>
  <div>
    <header>
      <div class="header-wrapper">
        <img src="http://acmelogos.com/images/logo-8.svg" alt="" class="logo">

        <nav>
          <router-link to="/">+ Главная страница</router-link>
          <router-link to="/admin">+ Админка</router-link>
          <router-link to="/blog" active-class="grey">+ Блог</router-link>
          <router-link to="/projects">+ Проекты</router-link>
          <router-link to="/contacts">+ Контакты</router-link>
        </nav>
      </div>
    </header>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      message: 'Welcome to Your Vue.js App'
    };
  }
}
</script>
