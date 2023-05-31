<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <main class="content container">
    <transition name="fade-out" appear>
      <div class="content__top">

        <div class="content__row">
          <h1 class="content__title">
            Каталог
          </h1>
          <span class="content__info">
            {{ setCountFormat() + setTotalNumberTitle }}
          </span>
          <label class="content__info--count">
            Показывать товаров:&nbsp;
            <select class="form__select--count"
              type="text" name="productsPerPage" v-model="productsPerPage">
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="18">18</option>
              <option value="24">24</option>
            </select>
          </label>
        </div>
      </div>
    </transition>

  <div class="content__catalog">

    <transition name="fade-out" appear>
      <ProductFilter
      :price-from.sync="filterPriceFrom"
      :price-to.sync="filterPriceTo"
      :category-id.sync="filterCategoryId"
      :selected-color.sync="filterColor"
      :selected-material.sync="filterMaterial"
      :selected-season.sync="filterSeason"
      :first-page.sync="firstPage"
      :max-product-price="currentMaxPrice"
      :min-product-price="currentMinPrice"/>
    </transition>

    <section class="catalog" v-if="productsLoading">
      <PreloaderIndicator class="main-spinner" />
    </section>

    <section class="catalog container-alignment container-alignment--load-fail"
      v-if="productsLoadingFailed">
      <div class="error-container">
        <h2 class="product-error-position">
            Произошла ошибка при загрузке товаров
        </h2>
        <button class="button button--error" @click.prevent="loadProducts()">
          Попробовать ещё раз
        </button>
      </div>
    </section>

    <section class="catalog" v-if="!productsLoadingFailed && !productsLoading">
      <div class="empty-products-list" v-if="emptyProductsList">
        <h3>Не нашлось подходящих товаров <br>Попробуйте поменять параметры или
          <button class="filters-reset" @click.prevent="reset">
            сбросить фильтры
          </button>
        </h3>
      </div>
      <ProductsList :products="products" :products-per-page="productsPerPage"/>
      <BasePagination
      v-model="page"
      :count="countProducts"
      :per-page="productsPerPage"/>
    </section>
  </div>
</main>
</template>

<script>

import ProductsList from '@/components/product/ProductsList.vue';
import ProductFilter from '@/components/product/ProductFilter.vue';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import { loadProducts, loadProductsAll } from '@/store/axios';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';

export default {
  components: {
    ProductsList, BasePagination, ProductFilter, PreloaderIndicator,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,

      filterColor: null,
      filterMaterial: null,
      filterSeason: null,

      firstPage: true,
      page: 1,
      productsPerPage: 6,

      productsData: null,
      productsDataAll: null,

      productsLoading: true,
      productsLoadingFailed: false,

      emptyProductsList: false,
      currentMaxPrice: null,
      currentMinPrice: null,
      tweenedNumber: 0,
    };
  },
  computed: {
    animatedCountTitle() {
      if (this.productsDataAll !== null) {
        return this.tweenedNumber.toFixed(0);
      } return 0;
    },
    products() {
      return this.productsData
        ? this.productsData.items
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    setTotalNumberTitle,
  },
  watch: {
    countProducts(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue });
    },
    page() {
      if (this.page !== 1) this.firstPage = false;
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
      this.page = 1;
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
    filterMaterial() {
      this.loadProducts();
    },
    filterSeason() {
      this.loadProducts();
    },
  },
  methods: {
    loadProducts,
    loadProductsAll,
    reset() {
      this.currentPage = true;
      this.filterCategoryId = 0;
      this.filterPriceFrom = '';
      this.filterPriceTo = '';
      this.filterColor = [];
      this.filterMaterial = [];
      this.filterSeason = [];
      this.emptyProductsList = false;
      window.location.hash = '';
    },
    maxProductPrice() {
      if (this.productsDataAll !== null) {
        return Math.max(...this.productsDataAll.items.map((i) => i.price));
      }
      return '';
    },
    minProductPrice() {
      if (this.productsDataAll !== null) {
        return Math.min(...this.productsDataAll.items.map((i) => i.price));
      }
      return '';
    },
    rotateArrow(event) {
      document.querySelectorAll('.form__select--count').forEach((el) => {
        if (event.target === el) {
          el.parentNode.classList.toggle('activeArrow');
          document.querySelector('.form__select').parentNode.classList.remove('activeArrow');
        } else if (event.target === document.querySelector('.form__select')) {
          document.querySelector('.form__select').parentNode.classList.toggle('activeArrow');
          el.parentNode.classList.remove('activeArrow');
        } else {
          document.querySelector('.form__select').parentNode.classList.remove('activeArrow');
          el.parentNode.classList.remove('activeArrow');
        }
      });
    },
    setCountFormat() {
      if (this.animatedCountTitle > 0) return this.animatedCountTitle;
      return 'нет';
    },
  },
  created() {
    this.filterCategoryId = +this.$route.query.categoryId || 0;
    this.loadProducts();
  },
  mounted() {
    document.body.addEventListener('click', this.rotateArrow);
  },
  destroyed() {
    document.body.removeEventListener('click', this.rotateArrow);
  },
};
</script>
