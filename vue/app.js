import Vue from 'vue/dist/vue.esm';
import hello from 'vue-loader!./components/hello.vue';

new Vue({
  el: '#app',
  components: {
    hello: hello
  }
});
