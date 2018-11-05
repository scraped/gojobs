<template>
  <div id="app">
    <vue-progress-bar/>

    <ui-navbar/>

    <transition
      name="fade"
      mode="out-in"
    >
      <main>
        <router-view/>
      </main>
    </transition>

    <ui-footer/>
  </div>
</template>

<script>
import UiNavbar from '@/layout/UiNavbar.vue';
import UiFooter from '@/layout/UiFooter.vue';

const sharedTitle = 'GTA Online Jobs';

export default {
  metaInfo: {
    htmlAttrs: {
      lang: 'en',
    },

    titleTemplate(title) {
      return title
        ? `${title} - ${sharedTitle}`
        : sharedTitle;
    },

    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1.0'},
      {'http-equiv': 'X-UA-Compatible', content: 'ie-edge'},
      {vmid: 'description', name: 'description', content: ''},
    ],

    link: [
      ...[
        'https://unpkg.com/normalize.css@8.0.0',
        'https://maxcdn.icons8.com/fonts/line-awesome/1.1/css/line-awesome-font-awesome.min.css',
      ].map(href => ({
        rel: 'stylesheet',
        href,
      })),
      {rel: 'favicon', href: 'favicon.ico'}
    ],
  },

  components: {
    UiNavbar,
    UiFooter,
  },
};
</script>
