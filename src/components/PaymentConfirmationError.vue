<template>
  <div class="payment-confirmation-error">
    <div class="payment-confirmation-error-container">
      <header>
        <h2>Oops... Something went wrong.</h2>
        <p>Sorry,</p>
      </header>
      <p class="confirmation-error">{{ errorMessage }}</p>
    </div>
    <div class="confirmation-image-container">
      <img src="../assets/paymentconfirmationerror.png" alt="sorry sign with person holding head down" />
    </div>
    <div class="home-link-container">
      <router-link :to="{name: 'Home'}"><i class="fas fa-home"></i> Return to Homepage</router-link>
    </div>
  </div>
</template>


<script>

export default {

  name: 'PaymentConfirmationError',

  components: {

  },

  props: {

    errorMessage: String,
    currentUserName: String,
  },

  data () {

    return {

    }
  },

  created () {

  },

  mounted () {

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

.confirmation-error {
  color: $red;
  text-align: center;
}

</style>