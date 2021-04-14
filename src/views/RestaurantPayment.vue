<template>
  <div class="restaurant-payment-container">
    <RestaurantPaymentOverlay
     title="Please Provide Payment"
     overlayImage="payment"
     overlayImageExt=".jpg"
    />
    <RestaurantPaymentBilling />
  </div>
</template>



<script>




import RestaurantPaymentOverlay from '../components/RestaurantPaymentOverlay';
import RestaurantPaymentBilling from '../components/RestaurantPaymentBilling';

  export default {

    name: 'RestaurantPayment',

    components: {

      RestaurantPaymentOverlay,
      RestaurantPaymentBilling,
    },

    props: {

    },

    data () {

      return {


      }
    },

    created() {

    },

    mounted() {

    },

    methods: {

    },
  }
</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;


.restaurant-payment-container {
  height: 100%;
}



</style>