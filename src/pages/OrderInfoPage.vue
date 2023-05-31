<template>
  <main class="content container" v-if="this.$store.state.order.orderInfo">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ this.$store.state.order.orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту
            придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.paymentType }}
              </span>
            </li>
            <li class="dictionary__item" v-if="this.$store.state.order.orderInfo.comment">
              <span class="dictionary__key">
                Комментарий к заказу
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.comment }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Статус заказа
              </span>
              <span class="dictionary__value">
                {{ this.$store.state.order.orderInfo.status.title }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order"
            v-for="item in this.$store.state.order.orderInfo.basket.items" :key="item.id">
              <h3>{{ item.product.title }}</h3>
              <b>{{ (item.product.price * item.quantity) | numberFormat }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
              <span>Количество: {{ item.quantity }}</span>
              <span>Размер: {{ item.size.title }}</span>
              <span class="cart__order-item">
                Цвет:
                <i :class="['colors__value', 'cart__order-item-color',
                  { 'value--black': item.color.color.code === '#ffffff' }]"
                  :style="'background-color:' + item.color.color.code"></i>
                {{ item.color.color.title }}
              </span>
            </li>
          </ul>

          <div class="cart__total">
            <p v-show="deliveryPrice != 0">Доставка: <b>{{ deliveryPrice }} ₽</b></p>
            <p v-show="deliveryPrice == 0">Доставка: <b>бесплатно</b></p>
            <p>
              Заказ: <b>{{ this.$store.state.order.orderInfo.basket.items.length }}</b>
              {{ setTotalNumberTitle }} на сумму
              <b>
                {{ (this.$store.state.order.orderInfo.totalPrice - deliveryPrice)
                | numberFormat }} ₽
              </b>
            </p>
            <p>Итого: <b>{{ this.$store.state.order.orderInfo.totalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';

export default {
  filters: {
    numberFormat,
  },
  computed: {
    setTotalNumberTitle,
    deliveryPrice() {
      return this.$store.state.order.orderInfo.deliveryType.price;
    },
  },
  created() {
    if
    (this.$store.state.order.orderInfo
    && this.$store.state.order.orderInfo.id === this.$route.params.id) {
      return;
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id)
      .catch(() => {
        this.$router.replace('/notFound');
      });
  },
};
</script>
