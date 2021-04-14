<template>
  <div class="confirmation-column">
    <div class="confirmation-box-container">
      <header>
        <h2><i class="far fa-envelope email-conformation-icon"></i> Email confirmation has been sent</h2>
        <p>hello <span>{{ currentUserName }}</span>
          <p>A confirmation email about your restaurant sign up with Grubbee has been sent to the email adress you used to register an account with us, <span>{{ currentUserEmail }}</span>. Inside the email you will find your restaurant you added and a notice of about Advertising.</p>
      </header>
    </div>
    <div class="confirmation-image-container">
      <img src="../assets/paymentconfirmationthanks.jpg" alt="thank you" />
    </div>
    <div class="home-link-container">
      <router-link :to="{name: 'Home'}"><i class="fas fa-home"></i> Return to Homepage</router-link>
    </div>
  </div>
</template>


<script>

export default {

  name: 'PaymentConfirmationSucess',

  components: {

  },

  props: {

    currentUserName: String,
    currentUserEmail: String,

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

.email-conformation-icon {
  color: $lightBlue;
}


</style>