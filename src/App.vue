<template>
  <div>
    <TheHeader />

    <transition :name="routeTransitionDirection" mode="out-in">
      <router-view :key="$route.name"/>
    </transition>

    <TheFooter />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  data() {
    return {
      routeTransitionDirection: 'slide-left-',
    };
  },
  components: {
    TheHeader,
    TheFooter,
  },
  watch: {
    $route(to, from) {
      const toDepth = to.meta.depth;
      const fromDepth = from.meta.depth;

      this.routeTransitionDirection = toDepth < fromDepth ? 'slide-right-' : 'slide-left-';
      setTimeout(() => window.scrollTo(0, 0), 700);
    },
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
};
</script>

<style>
.slide-left--enter-active,
.slide-left--leave-active,
.slide-right--enter-active,
.slide-right--leave-active {
  transition: transform .7s ease-in-out, opacity .7s ease-in-out
}

.slide-left--enter,
.slide-right--leave-to {
  opacity: 0;
  transform: translate3d(100%,0,0)
}

.slide-right--enter,
.slide-left--leave-to {
  opacity: 0;
  transform: translate3d(-100%,0,0)
}

</style>
