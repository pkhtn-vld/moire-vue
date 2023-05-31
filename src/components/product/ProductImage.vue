<template>
  <div class="img-container" :class="{'img-container-size-12' : sizeMultipleFour}">
    <PreloaderIndicator :class="['item-spinner', {'item-spinner-size-12' : sizeMultipleFour}]"
    v-show="!productsLoading"/>
    <transition name="fade" mode="out-in">
      <img :class="{'value--black' : selectedImage == 'img/image-not-found.png',
      'catalog__pic-size-12 img' : sizeMultipleFour}"
        :src="selectedImage" :alt="product.title" @load="loadList()" v-show="productsLoading">
    </transition>
    </div>
</template>

<script>
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default {
  data() {
    return {
      productsLoading: false,
    };
  },
  props: ['product', 'selectedColor', 'sizeMultipleFour'],
  components: { PreloaderIndicator },
  computed: {
    mainColor() {
      return this.product.colors.find((i) => i.color.id === this.selectedColor);
    },
    selectedImage() {
      if (this.mainColor.gallery !== null) {
        return this.mainColor.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    },
  },
  methods: {
    loadList() {
      this.productsLoading = true;
    },
  },
};
</script>
