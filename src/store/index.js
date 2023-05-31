import Vue from 'vue';
import Vuex from 'vuex';

import cart from '@/store/modules/cart';
import order from '@/store/modules/order';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart,
    order,
  },
});
