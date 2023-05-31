<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ setCountFormat() + setTotalNumberTitle }}
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <PreloaderIndicator class="cart-spinner-main"
          v-show="!loadCartSuccess"/>
          <ul class="cart__list" v-show="loadCartSuccess">
            <CartItem v-for="item in products" :key="item.productId" :item="item"
            @updateProductLoading ="loadCartSuccess = $event"/>
          </ul>
          <transition name="fade">
            <h3 v-show="loadCartSuccess && setTotalPrice() === 0">
              В корзине пока пусто. Чтобы выбрать товары перейдите в
              <router-link :to="{name: 'main'}" custom v-slot="{ navigate }">
                <button class="filters-reset" @click="navigate"
                @keypress.enter="navigate" role="link">каталог</button>
              </router-link>
            </h3>
          </transition>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price" v-if="setTotalPrice() === 0">
            Ничего не выбрано
          </p>
          <p class="cart__price" v-if="setTotalPrice() > 0">
            Итого: <span>{{ setTotalPrice() | numberFormat }} ₽</span>
          </p>

          <router-link class="cart__button button button--primery" type="submit"
            v-show="totalNumber > 0" :to="{name: 'order'}">
              Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import CartItem from '@/components/cart/CartItem.vue';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import numberFormat from '@/helpers/numberFormat';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';

export default {
  data() {
    return {
      loadCartSuccess: false,
      productsEmpty: false,
      tweenedNumber: 0,
      commonCartPrice: 0,
    };
  },
  components: { CartItem, PreloaderIndicator },
  filters: { numberFormat },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', totalNumber: 'cartTotalNumber' }),
    setTotalNumberTitle,
    loadingCart() {
      return this.$store.state.cart.loadingCart;
    },
    animatedTotalPrice() {
      return this.tweenedNumber.toFixed(0);
    },
  },
  watch: {
    commonCartPrice(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
    },
    totalPrice() {
      this.commonCartPrice = this.totalPrice;
    },
  },
  methods: {
    isProductsEmpty() {
      if (this.products?.length === 0) {
        this.loadCartSuccess = true;
      }
    },
    setTotalPrice() {
      if (+this.animatedTotalPrice === 0) {
        this.commonCartPrice = this.totalPrice;
        return this.commonCartPrice;
      }
      return this.animatedTotalPrice;
    },
    setCountFormat() {
      if (this.totalNumber > 0) return this.totalNumber;
      return 'нет';
    },
  },
  created() {
    if (this.$route.params.goToPage) {
      this.isProductsEmpty();
    }
  },
  updated() {
    this.isProductsEmpty();
  },
};

</script>
