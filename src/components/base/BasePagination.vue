<template>
   <ul class="catalog__pagination pagination">
          <li class="pagination__item">

            <a :class="['pagination__link', 'pagination__link--arrow',
            {'pagination__link--disabled': page === 1}]"
            href="#"
            @click.prevent="previousPage(page)"
            aria-label="Предыдущая страница">

            <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>

          <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
            <a :class="['pagination__link', {'pagination__link--current': pageNumber === page}]"
            href="#"
            @click.prevent="paginate(pageNumber)">
            {{ pageNumber }}
            </a>
          </li>
          <li class="pagination__item">
            <a
            :class="['pagination__link', 'pagination__link--arrow',
            {'pagination__link--disabled': page === pages}]"
            href="#"
            @click.prevent="nextPage(page)"
            aria-label="Следующая страница">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>
</template>

<script>

export default {
  model: {
    prop: 'page',
    event: 'paginate',
  },
  props: ['page', 'count', 'perPage', 'productsLoading'],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      this.$emit('paginate', page);
      this.smoothScroll();
    },
    nextPage(page) {
      if (page < Math.ceil(this.count / this.perPage)) {
        this.$emit('paginate', page + 1);
        this.smoothScroll();
      }
    },
    previousPage(page) {
      if (page > 1) {
        this.$emit('paginate', page - 1);
        this.smoothScroll();
      }
    },
    smoothScroll() {
      setTimeout(() => {
        document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 0);
    },
  },
};
</script>
