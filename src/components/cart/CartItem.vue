<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <li class="cart__item product">
    <div class="product__container-preload" v-if="deletingProduct">
      <PreloaderIndicator class="spinner cart-spinner"/>
    </div>

    <template v-else>
      <div class="product__pic">
        <transition name="fade" mode="out-in">
          <img :src="selectedImage" width="120" height="120"
          :alt="item.product.title" @load="loadList()" v-show="productsLoading">
        </transition>
        <PreloaderIndicator class="cart-spinner-img" v-show="!productsLoading"/>
      </div>
      <h3 class="product__title">
        {{ item.product.title }}
      </h3>
      <p class="product__info product__info--size">
        Размер: {{ item.sizeTitle }}
      </p>
      <p class="product__info product__info--color">
        Цвет:
        <span>
          <i :class="['colors__value',
          {'value--black' : item.colorId === '#ffffff'}]"
          :style="'background-color:' + item.colorId"></i>
          {{ item.colorTitle }}
        </span>
      </p>
      <span class="product__code">
        Артикул: {{ item.productId }}
      </span>

      <div class="product__counter form__counter">
        <button type="button" aria-label="Убрать один товар"
        @click.prevent="decreaseСount()">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-minus"></use>
          </svg>
        </button>

        <input type="text" @input.prevent="" class="count" v-model.number="amount" name="count">

        <button type="button" aria-label="Добавить один товар"
        @click.prevent="increaseСount()">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <b class="product__price">
        {{ animatedItemPrice | numberFormat }} ₽
      </b>

      <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
      @click.prevent="deleteItem(item.productId)">
        <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
          <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
        </svg>
      </button>
    </template>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import setInputFormat from '@/helpers/inputFormat';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default {
  data() {
    return {
      productsLoading: false,
      deletingProduct: false,
      tweenedNumber: 0,
    };
  },
  props: ['item'],
  components: { PreloaderIndicator },
  filters: { numberFormat },
  computed: {
    productPrice() {
      return (this.item.amount * this.item.product.price);
    },
    animatedItemPrice() {
      return this.tweenedNumber.toFixed(0);
    },
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { basketItemId: this.item.productId, amount: value });
      },
    },
    mainColor() {
      return this.item.product.colors.find((i) => i.color.code === this.item.colorId);
    },
    selectedImage() {
      if (this.mainColor.gallery !== null) {
        return this.mainColor.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    },
    loadingDeletingCart() {
      return this.$store.state.cart.deletingCart;
    },
  },
  watch: {
    productPrice(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
    },
    amount() {
      if (this.amount === 0 || this.amount === '') this.amount = 1;
    },
  },
  methods: {
    ...mapActions({ deleteProduct: 'deleteCartProduct' }),
    increaseСount() {
      this.amount += 1;
    },
    decreaseСount() {
      if (this.amount > 1) {
        this.amount -= 1;
      }
    },
    async deleteItem(id) {
      this.deletingProduct = true;
      await this.deleteProduct(id);
      this.deleteProduct = false;
    },
    loadList() {
      this.productsLoading = true;
      this.$emit('updateProductLoading', true);
      // eslint-disable-next-line no-undef
      gsap.to(
        this.$data,
        { duration: 0.5, tweenedNumber: (this.item.amount * this.item.product.price) },
      );
    },
    setInputFormat,
  },
  updated() {
    this.setInputFormat('.count', 2);
  },
};
</script>
