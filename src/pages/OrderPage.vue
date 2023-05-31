<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <main class="content container">
      <transition name="fade-out" appear>
        <div class="content__top">
          <ul class="breadcrumbs">
            <li class="breadcrumbs__item">
              <router-link class="breadcrumbs__link" :to="{name: 'main'}">
                Каталог
              </router-link>
            </li>
            <li class="breadcrumbs__item">
              <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
                Корзина
              </router-link>
            </li>
            <li class="breadcrumbs__item">
              <a class="breadcrumbs__link">
                Оформление заказа
              </a>
            </li>
          </ul>

          <div class="content__row">
            <h1 class="content__title">
              Оформление заказа
            </h1>
          </div>
        </div>
      </transition>

      <transition name="fade-out" appear>
        <section class="cart">
          <form class="cart__form form" action="#" method="POST" @submit.prevent="sendOrder">
            <div class="cart__field">
              <div class="cart__data">

                <BaseFormText v-model="formData.name" title="ФИО" :error="formError.name"
                placeholder="Введите ваше полное имя" type="text"/>

                <BaseFormText v-model="formData.address" title="Адрес доставки"
                :error="formError.address" placeholder="Введите ваш адрес" type="text"/>

                <BaseFormText v-model="formData.phone" title="Телефон" :error="formError.phone"
                placeholder="Введите ваш телефон" type="text" v-mask="'+7 (###) ###-##-##'"/>

                <BaseFormText v-model="formData.email" title="Email" :error="formError.email"
                placeholder="Введи ваш Email" type="email"/>

                <BaseFormTextarea v-model="formData.comment" title="Комментарий к заказу"
                :error="formError.comment" placeholder="Ваши пожелания"/>
              </div>

              <div class="cart__options">
                <h3 class="cart__title">Доставка</h3>

                <DeliveryType :delivery-data="deliveryData"
                @updateDeliveryType="deliveryType = $event"/>

                <h3 class="cart__title">Оплата</h3>
                <PaymentType :payment-data="paymentData"
                @updatePaymentType="paymentType = $event"
                :delivery-type="deliveryType"/>
              </div>
            </div>

            <OrderCheckoutBlock :delivery-data="deliveryData" :delivery-type="deliveryType"
            :order-sending="orderSending"/>

            <div class="cart__error form__error-block" v-if="formError.paymentTypeId">
              <h4>Заявка не отправлена!</h4>
              <p>
                {{ formError.paymentTypeId }}
              </p>
            </div>
          </form>
        </section>
      </transition>
    </main>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import OrderCheckoutBlock from '@/components/order/OrderCheckoutBlock.vue';
import BaseFormText from '@/components/base/BaseFormText.vue';
import BaseFormTextarea from '@/components/base/BaseFormTextarea.vue';
import { sendOrder } from '@/store/axios';
import DeliveryType from '@/components/order/DeliveryType.vue';
import PaymentType from '@/components/order/PaymentType.vue';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderSending: false,
      deliveryType: 1,
      paymentType: 1,
    };
  },
  props: ['error'],
  components: {
    BaseFormText,
    BaseFormTextarea,
    OrderCheckoutBlock,
    DeliveryType,
    PaymentType,
  },

  computed: {
    ...mapGetters({ totalNumber: 'cartTotalNumber' }),
    deliveryData() {
      return this.$store.state.order.deliveryData;
    },
    paymentData() {
      return this.$store.state.order.paymentData;
    },
  },

  methods: {
    ...mapActions(['loadDeliveryTypes', 'loadPaymentTypes']),
    sendOrder,
  },
  created() {
    this.loadDeliveryTypes();
    this.loadPaymentTypes();
  },
};
</script>
