<template>
  <transition name="fade-out" appear>
    <div class="cart__block">

      <PreloaderIndicator class="order-spinner" v-if="products.length === 0"/>

      <transition name="fade-out">
        <ul class="cart__orders"  v-if="products.length > 0">
          <li class="cart__order" v-for="item in products" :key="item.productId" :item="item">
            <h3>{{ item.product.title }}</h3>
            <b>{{ (item.amount * item.product.price) | numberFormat }} ₽</b>
            <span>Артикул: {{ item.product.id }}</span>
            <span>Количество: {{ item.amount }}</span>
            <span>Размер: {{ item.sizeTitle }}</span>
            <span class="cart__order-item">
              Цвет:
              <i :class="['colors__value','cart__order-item-color',
              {'value--black' : item.colorId === '#ffffff'}]"
              :style="'background-color:' + item.colorId"></i>
              {{ item.colorTitle }}
            </span>
          </li>
        </ul>
      </transition>

      <transition name="fade-out">
        <div class="cart__total"  v-if="products.length > 0">
          <p v-show="deliveryPrice != 0">Доставка: <b>{{ deliveryPrice }} ₽</b></p>
          <p v-show="deliveryPrice == 0">Доставка: <b>бесплатно</b></p>
          <p>Заказ: <b>{{ totalNumber }}</b> {{ setTotalNumberTitle }} на сумму
            <b>{{ totalPrice | numberFormat }} ₽</b>
          </p>
          <p>
            Итого: <b>{{ setInfoPrice() | numberFormat }} ₽</b>
          </p>
        </div>
      </transition>

        <button class="cart__button button button--primery" type="submit"
        v-show="(totalNumber > 0) && !orderSending" :disabled="orderSending"
        v-if="products.length > 0">
          Оформить заказ
        </button>

        <button class="cart__button button button--primery transperent" type="submit"
        v-show="orderSending" :disabled="orderSending">
        Оформить заказ
          <PreloaderIndicator class="page-spinner-mini"/>
        </button>
    </div>
  </transition>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default {
  data() {
    return {
      tweenedNumber: 0,
      commonInfoPrice: 0,
    };
  },
  props: ['orderSending', 'deliveryData', 'deliveryType'],
  components: { PreloaderIndicator },
  filters: {
    numberFormat,
  },

  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', totalNumber: 'cartTotalNumber' }),
    setTotalNumberTitle,
    deliveryPrice() {
      return this.deliveryData[this.deliveryType - 1]?.price;
    },
    animatedInfoPrice() {
      return this.tweenedNumber.toFixed(0);
    },
  },
  watch: {
    commonInfoPrice(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
    },
    deliveryPrice() {
      this.commonInfoPrice = this.totalPrice + +this.deliveryPrice;
    },
  },
  methods: {
    setInfoPrice() {
      if (+this.animatedInfoPrice === 0) {
        this.commonInfoPrice = this.totalPrice;
        return this.commonInfoPrice;
      } return this.animatedInfoPrice;
    },
  },
};
</script>
