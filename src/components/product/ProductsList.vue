<template>
    <ul class="catalog__list"
    :class="{'catalog__list-size-12' : sizeMultipleFour}">
    <ProductItem
    v-for="product in products"
    :product="product"
    :key="product.id"
    :size-multiple-four="sizeMultipleFour"
    :product-loading-modal="productLoading"
    @updateProductId="productId = $event"
    @updateColor="currentColor = $event"/>

    <ProductModal :product-id.sync="productId" :current-color.sync="currentColor"
    @updateProductLoading="productLoading = $event"/>
    </ul>
</template>

<script>
import ProductItem from '@/components/product/ProductItem.vue';
import ProductModal from './ProductModal.vue';

export default {
  data() {
    return {
      sizeMultipleFour: false,
      productId: null,
      currentColor: 0,
      productLoading: null,
    };
  },
  components: { ProductItem, ProductModal },
  props: ['products', 'productsPerPage'],
  methods: {
    isMultipleSize() {
      if (this.productsPerPage % 4 === 0) {
        this.sizeMultipleFour = true;
        return this.sizeMultipleFour;
      } return this.sizeMultipleFour;
    },
  },
  created() {
    this.isMultipleSize();
  },
};
</script>
