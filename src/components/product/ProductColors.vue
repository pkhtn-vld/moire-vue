<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul class="colors colors--black" :class="{'colors-size-12' : sizeMultipleFour}">
  <li class="colors__item" v-for="option in product.colors"
  :key="option.color.id">
    <label class="colors__label">
      <input class="colors__radio sr-only" type="radio"
      :value="option.color.id" v-model="selectedColor"
      @click="changeColor">
      <span :class="['colors__value',
        {'value--black' : option.color.code === '#ffffff'}]"
      :style="'background-color:' + option.color.code + ';'"
      >
      </span>
    </label>
  </li>
</ul>
</template>

<script>

export default {
  props: ['product', 'sizeMultipleFour'],
  data() {
    return {
      selectedColor: this.product.colors[0].color.id,
    };
  },
  methods: {
    changeColor(event) {
      this.selectedColor = +event.target.value;
      this.$emit('updateColor', this.selectedColor);
    },
  },
};
</script>
