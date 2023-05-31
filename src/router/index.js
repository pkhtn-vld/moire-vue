import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'main', component: MainPage, path: '/', meta: { depth: 1 },
  },
  {
    name: 'product', component: ProductPage, path: '/product/:id', meta: { depth: 2 },
  },
  {
    name: 'cart', component: CartPage, path: '/cart/', meta: { depth: 3 },
  },
  {
    name: 'order', component: OrderPage, path: '/order/', meta: { depth: 4 },
  },
  {
    name: 'orderInfo', component: OrderInfoPage, path: '/order/:id', meta: { depth: 5 },
  },
  {
    name: 'notFound', component: NotFoundPage, path: '*', meta: { depth: 6 },
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
