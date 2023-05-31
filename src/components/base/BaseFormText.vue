<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <BaseFormField :title="title" :error="error">
    <input class="form__input" v-model="dataValue" :type="type" :placeholder="placeholder"
    :v-mask="mask">
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  props: ['type', 'mask'],
  mixins: [formFieldMixin],
};
</script>
