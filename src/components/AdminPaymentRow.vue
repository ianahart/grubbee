<template>
  <tr :class="{
        'completed-payment': payment.status === 'completed',
        'refunded-payment': payment.status === 'refunded',
        'cancelled-payment': payment.status === 'cancelled'
        }">
        <AdminPaymentCheckbox
          @checkboxtoggle="sendSelectPayment"
          :payment="payment"
          :selectedWasReset="selectedWasReset"
        />
        <td>{{ payment.formattedDate }}</td>
        <td>{{ payment.associatedUserId  }}</td>
        <td>{{ payment.cardbrand }}</td>
        <td>{{ payment.status }}</td>
        <td>{{ payment.amount }}</td>
  </tr>
</template>


<script>

import AdminPaymentCheckbox from './AdminPaymentCheckbox';


export default {

  name: 'AdminPaymentRow',

  props: {
    payment: Object,
    selectedWasReset: Boolean,
  },

  components: {

    AdminPaymentCheckbox,
  },

  data () {

    return {
      isBoxChecked: false,
    }
  },

  created () {

  },

  mounted () {

  },

  methods: {


     sendSelectPayment({ checkbox, payment }) {

       this.$emit('select',

       {
         checkbox,
         payment
       }
      );
     }
  },
}




</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;





























</style>