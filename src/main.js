import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import VueMask from 'v-mask';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueMask);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
