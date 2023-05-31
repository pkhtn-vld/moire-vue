<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div>
    <transition name="modal" mode="out-in">
      <main class="popup container-alignment visible" v-if="productLoading">
          <svg class="spinner modal-spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
      </main>
    </transition>

    <transition name="modal" mode="out-in">
      <main class="popup container-alignment" v-if="loadError"
      :class="{'visible' : loadError}">
        <div class="error-container modal-error-container">
          <button class="product__del button-del button-abs"
          type="button" aria-label="Закрыть модальное окно"
            @click.prevent="closeModalError">
            <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
              <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
            </svg>
          </button>
          <h2 class="product-error-position modal-text-color">
            Произошла ошибка при загрузке товара
          </h2>
          <button class="button button--primery" @click.prevent="loadProductModal()">
            Попробовать ещё раз
          </button>
        </div>
      </main>
    </transition>

    <transition name="modal" mode="out-in">
      <main class="popup popup-main" v-if="product" :class="{'visible' : activeModal}">

        <section class="item modal-item">
          <div class="item__pics pics">
            <div class="pics__wrapper--modal">
              <transition name="image" mode="out-in">
                <ProductImage class="product-page__image" :product="product"
                :selectedColor="selectedColor" :key="selectedColor"/>
              </transition>
            </div>
            <ul class="pics__list" v-show="loadImg">
              <li class="pics__item" v-for="color in product.colors" :key="color.id">
                <label>
                  <div class="pics__link"
                  :class="{ 'pics__link--current': isActiveImage(color.color.id) }">
                    <input class="product-page__image-input"
                      type="radio"
                      :value="color.color.id"
                      v-model="selectedColor"/>

                    <transition name="fade" mode="out-in">
                      <img width="98" height="98" @load="loadImgList"
                      :class="{'value--black' : viewImageExtra(color) == 'img/image-not-found.png'}"
                      :src="viewImageExtra(color)" :alt="color.title" v-show="loadImg">
                    </transition>
                  </div>
                </label>
              </li>
            </ul>
            <ul class="pics__list" v-show="!loadImg">
              <li class="pics__item" v-for="color in product.colors" :key="color.id">
                <label>
                  <div class="pics__link">
                    <input class="product-page__image-input"
                      type="radio"/>
                      <PreloaderIndicator class="modal-spinner-mini" v-show="!loadImg"/>
                  </div>
                </label>
              </li>
            </ul>
          </div>

          <div class="item__info">
            <span class="item__code">Артикул: {{ product.id }}</span>
            <h2 class="item__title">
              {{ product.title }}
            </h2>
            <div class="item__form">
              <form class="form" action="#" method="POST" @submit.prevent="addToCartModal">
                <div class="item__row item__row--center">
                  <!-- <div class="form__counter">
                    <button type="button" aria-label="Убрать один товар"
                    @click.prevent="decreaseСount()">
                      <svg width="12" height="12" fill="currentColor">
                        <use xlink:href="#icon-minus"></use>
                      </svg>
                    </button>

                    <input class="count" type="text" value="1"
                    name="count" v-model.number="productAmount">

                    <button type="button" aria-label="Добавить один товар"
                    @click.prevent="increaseСount()">
                      <svg width="12" height="12" fill="currentColor">
                        <use xlink:href="#icon-plus"></use>
                      </svg>
                    </button>
                  </div> -->

                  <b class="item__price">
                    {{ product.price | numberFormat }} ₽
                  </b>
                </div>

                <div class="item__row">
                  <fieldset class="form__block">
                    <legend class="form__legend">Цвет</legend>
                    <ul class="colors colors--black">
                      <li class="colors__item" v-for="option in product.colors"
                      :key="option.color.id" @updateColor="selectedColor = $event">
                        <label class="colors__label">
                          <input class="colors__radio sr-only" type="radio"
                          name="color-item" :value="option.color.id" v-model.number="selectedColor">
                          <span :class="['colors__value',
                          {'value--black' : option.color.code === '#ffffff'}]"
                          :style="{ 'background-color': option.color.code }">
                          </span>
                        </label>
                      </li>
                    </ul>
                  </fieldset>
                  <fieldset class="form__block">
                    <legend class="form__legend">Размер</legend>
                    <label class="form__label form__label--small form__label--select"
                    :class="{activeArrow, 'error-size' : sizeError}">
                      <select class="form__select-modal" type="text" name="category"
                      v-model.number="currentSizeId">
                        <option hidden value="0">Выберите размер</option>
                        <option :value="size.id" v-for="size in product.sizes" :key="size.id">
                          {{ size.title }}
                        </option>
                      </select>
                    </label>
                  </fieldset>
                </div>

                <button class="item__button button button--primery" type="submit"
                :disabled="sizeError" v-if="!productAddSending && !productSelected">
                  В корзину
                </button>

                <button class="item__button button button--primery transperent" type="submit"
                :disabled="productAddSending" v-if="productAddSending">
                  В корзину
                <PreloaderIndicator class="page-spinner-mini"/>
                </button>

                <button class="item__button button button--cart"
                @click.prevent="goToCart" @keypress.enter="navigate"
                v-if="!productAddSending && productSelected">
                  Перейти в корзину
                </button>

                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position item-load-succsess" v-show="productAdded">
                    Товар успешно добавлен!
                  </h3>
                </transition>
                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position" v-show="productAddSending">
                    Добавляем товар в корзину...
                  </h3>
                </transition>
                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position item-load-error" v-show="sizeError">
                    У выбранного товара нет такого размера
                  </h3>
                </transition>

              </form>
            </div>
          </div>

          <button class="product__del button-del button-abs"
          type="button" aria-label="Закрыть модальное окно"
            @click.prevent="closeModal">
            <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
              <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
            </svg>
          </button>
        </section>
      </main>``
    </transition>
  </div>
</template>

<script>

import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import ProductImage from '@/components/product/ProductImage.vue';
import { loadProductModal, addToCartModal } from '@/store/axios';

let countImg = 0;

export default {
  data() {
    return {
      productAmount: 1,
      currentSizeId: 0,
      product: null,
      selectedColor: 0,

      productLoading: false,
      productAdded: false,
      productAddSending: false,
      productSelected: false,
      loadError: false,
      loadImg: false,

      sizeError: false,
      activeArrow: false,
      activeModal: false,
    };
  },
  components: { ProductImage, PreloaderIndicator },
  props: ['productId', 'currentColor'],
  filters: {
    numberFormat,
  },
  computed: {
    viewImage() {
      if (this.product !== null) {
        if (this.product.colors[0].gallery !== null) {
          return this.product.colors[0].gallery[0].file.url;
        }
      }
      return 'img/image-not-found.png';
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),

    loadProductModal,
    addToCartModal,
    increaseСount() {
      this.productAmount = +this.productAmount + 1;
    },
    decreaseСount() {
      if (this.productAmount > 1) this.productAmount = +this.productAmount - 1;
    },
    viewImageExtra(color) {
      if (color.gallery !== null) {
        return color.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    },
    isActiveImage(colorId) {
      return this.selectedColor === colorId;
    },
    rotateArrow(event) {
      if (event.target === document.querySelector('.form__select-modal')) {
        this.activeArrow = !this.activeArrow;
      } else this.activeArrow = false;
    },
    closeModal() {
      this.activeModal = false;
      this.product = null;
      this.productAmount = 1;
      this.currentSizeId = 0;
      this.selectedColor = 0;
      this.$emit('update:productId', null);
      this.$emit('update:currentColor', 0);
    },
    closeModalError() {
      this.loadError = false;
      this.$emit('update:productId', null);
      this.$emit('update:currentColor', 0);
    },
    loadImgList() {
      countImg += 1;
      if (+document.querySelector('.pics__list').childElementCount === +countImg) {
        this.loadImg = true;
        countImg = 0;
        return true;
      }
      this.loadImg = false;
      return false;
    },
    closeModalClickPast(event) {
      if (event.target === document.querySelector('.popup-main')) {
        this.closeModal();
      }
    },
    async goToCart() {
      await this.closeModal();
      setTimeout(() => {
        this.$router.replace('/cart');
      }, 300);
    },
  },
  watch: {
    currentSizeId() {
      if (this.currentSizeId !== 0) {
        this.sizeError = false;
      }
      this.productSelected = false;
    },
    productId() {
      if (this.productId !== null) {
        this.loadProductModal();
        this.activeModal = true;
      }
    },
    currentColor() {
      this.selectedColor = this.currentColor;
    },
    selectedColor() {
      this.productSelected = false;
    },
    activeModal() {
      const paddingRightBody = window.innerWidth - document.body.clientWidth;
      if (this.activeModal === true) {
        document.body.style.overflowY = 'hidden';
        document.body.style.paddingRight = `${paddingRightBody}px`;
      } else {
        setTimeout(() => {
          document.body.style.overflowY = 'visible';
          document.body.style.paddingRight = '0';
        }, 400);
      }
    },
  },
  mounted() {
    document.body.addEventListener('click', this.rotateArrow);
  },
  updated() {
    document.body.addEventListener('click', this.closeModalClickPast);
  },
  destroyed() {
    document.body.removeEventListener('click', this.rotateArrow);
    document.body.removeEventListener('click', this.closeModalClickPast);
  },
};
</script>

<style>
.popup {
  position: fixed;
  display: none;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.visible {
  display: flex;
}

.modal-item {
  position: relative;
  max-width: 48%;
  padding: 30px;
  background-color: #fff;
}

.button-abs {
  grid-column: unset;
  position: absolute;
  top: 0px;
  right: 28px;
}

.bgc-white {
  background-color: #fff;
}

.modal-spinner {
  width: 200px;
  height: 200px;
  top: 38%;
  left: 45%;
}

.modal-text-color {
  color: #fff;
}

.modal-error-container {
  position: relative;
  padding: 30px;
}

</style>
