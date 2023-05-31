export default function setTotalNumberTitle() {
  let countText;
  let conditionValue = this.countProducts || this.totalNumber;
  if (this.$store.state.order.orderInfo !== null) {
    conditionValue = this.$store.state.order.orderInfo.basket.items.length;
  }
  if (conditionValue === 1) {
    countText = ' товар';
  } else if ((conditionValue > 1) && (conditionValue < 5)) {
    countText = ' товара';
  } else {
    countText = ' товаров';
  }
  return countText;
}
