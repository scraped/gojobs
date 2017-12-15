import { createApp } from './app';

const { app, router, store } = createApp();

router.onError(() => {
  app.$mount('#app');
});
