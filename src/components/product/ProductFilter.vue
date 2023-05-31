<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <aside class="filter">
    <form class="filter__form form" action="#"
    method="get" @submit.prevent="submit">

    <fieldset class="form__block">
      <legend class="form__legend">Цена</legend>
      <label class="form__label form__label--price">

        <input class="form__input"
        :placeholder="animatedPriceFrom"
        name="min-price" v-model.number="currentPriceFrom">

        <span class="form__value">От</span>
      </label>
      <label class="form__label form__label--price">

        <input class="form__input" type="text" :placeholder="animatedPriceTo"
        name="max-price" v-model.number="currentPriceTo">
        <span class="form__value">До</span>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Категория</legend>
      <label class="form__label form__label--select">
        <select class="form__select" type="text" name="category"
        v-model.number="currentCategoryId">
          <option value="0">Все категории</option>
          <option :value="category.id" v-for="category in categories"
          :key="category.id">
            {{ category.title }}
          </option>
        </select>
      </label>
    </fieldset>
    <fieldset class="form__block">
      <legend class="form__legend">Цвет</legend>
      <ul class="colors colors--black">
        <li class="colors__item" v-for="color in colors" :key="color.id">

          <label class="colors__label">
            <input class="colors__radio sr-only" type="checkbox" name="color"
            :value="color.id" v-model.number="currentColor">
            <span class="colors__value" :style="{ 'background-color': color.code }"
            :class="['colors__value', {'value--black' : color.code === '#ffffff'}]">
            </span>
          </label>
        </li>
      </ul>
    </fieldset>
    <fieldset class="form__block">
      <legend class="form__legend">Материал</legend>
      <ul class="check-list">
        <li class="check-list__item" v-for="material in materials" :key="material.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox"
            name="material" :value="material.id" v-model="currentMaterial">
            <span class="check-list__desc">
              {{ material.title }}
              <span>{{ material.productsCount }}</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Коллекция</legend>
      <ul class="check-list">
        <li class="check-list__item" v-for="season in seasons" :key="season.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox"
            name="collection" :value="season.id" v-model="currentSeason">
            <span class="check-list__desc">
              {{ season.title }}
              <span>{{ season.productsCount }}</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <button class="filter__submit button button--primery" type="submit">
      Применить
    </button>
    <transition name="fade-out">
      <button class="filter__reset button button--second" type="button"
        @click.prevent="reset" v-show="resetButton()">
        Сбросить
      </button>
    </transition>
  </form>
  </aside>
</template>

<script>

import setInputFormat from '@/helpers/inputFormat';
import {
  loadCategories, loadColors, loadMaterials, loadSeasons,
} from '@/store/axios';

export default {
  data() {
    return {
      currentPriceFrom: '',
      currentPriceTo: '',
      currentCategoryId: +this.$route.query.categoryId || 0,

      currentSeason: [],
      currentColor: [],
      currentMaterial: [],

      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null,
      currentPage: null,
      tweenedNumberFrom: 0,
      tweenedNumberTo: 0,
    };
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'selectedColor',
    'selectedMaterial',
    'selectedSeason',
    'firstPage',
    'maxProductPrice',
    'minProductPrice'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
    animatedPriceTo() {
      return this.tweenedNumberTo.toFixed(0);
    },
    animatedPriceFrom() {
      return this.tweenedNumberFrom.toFixed(0);
    },
  },
  watch: {
    minProductPrice(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumberFrom: newValue });
    },
    maxProductPrice(newValue) {
      // eslint-disable-next-line no-undef
      gsap.to(this.$data, { duration: 0.5, tweenedNumberTo: newValue });
    },
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    selectedColor(value) {
      this.currentColor = value;
    },
    selectedMaterial(value) {
      this.currentMaterial = value;
    },
    selectedSeason(value) {
      this.currentSeason = value;
    },
  },
  methods: {
    submit() {
      this.currentPage = true;
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:selectedColor', this.currentColor);
      this.$emit('update:selectedMaterial', this.currentMaterial);
      this.$emit('update:selectedSeason', this.currentSeason);
      this.$emit('update:firstPage', this.currentPage);
      document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setTimeout(() => {
        window.location.hash = '';
      }, 1000);
    },
    reset() {
      this.currentPage = true;
      this.$emit('update:priceFrom', '');
      this.$emit('update:priceTo', '');
      this.$emit('update:categoryId', 0);
      this.$emit('update:selectedColor', []);
      this.$emit('update:selectedMaterial', []);
      this.$emit('update:selectedSeason', []);
      this.$emit('update:firstPage', this.currentPage);
      this.currentPriceFrom = '';
      this.currentPriceTo = '';
      this.currentCategoryId = 0;
      document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setTimeout(() => {
        window.location.hash = '';
      }, 1000);
    },
    loadCategories,
    loadColors,
    loadMaterials,
    loadSeasons,
    setInputFormat,
    resetButton() {
      return (this.currentPriceFrom !== '') || (this.currentPriceTo !== '')
       || (this.currentCategoryId !== 0) || (this.currentColor.length !== 0)
       || (this.currentMaterial.length !== 0) || (this.currentSeason.length !== 0)
       || (this.firstPage === false);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
  mounted() {
    this.setInputFormat('.form__input', 7);
  },
};
</script>
