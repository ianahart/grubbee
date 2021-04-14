<template>
  <div class="home-container">
    <p v-if="refundEmailSent"  class="email-notification"> <i class="far fa-envelope"></i> A refund email confirmation has been sent to the email that is connected to your account.</p>
    <HomeHeader />
    <HomeOffers />
    <HomeTestimonials />
  </div>
</template>

<script>

import axios from 'axios';
import { firebase } from '@firebase/app';


import HomeHeader from '../components/HomeHeader.vue';
import HomeOffers from '../components/HomeOffers.vue';
import HomeTestimonials from '../components/HomeTestimonials.vue';

export default {
  name: 'Home',

  props: {

  },

  components: {

   HomeHeader,
   HomeOffers,
   HomeTestimonials,

  },

  data() {
    return {

      emailRecipientUserId: '',
      isQueryString: false,
      refundEmailSent: false,
      timerID: null,
      db:firebase.firestore(),
    };
  },

  watch: {
    refundEmailSent: function () {

      if (this.refundEmailSent) {

       this.timerID = setTimeout(

          () => {

          this.refundEmailSent = false;
        }, 10000);
      }
    },
  },

  beforeDestroy() {

    clearTimeout(this.timerID);
  },

  created() {

    this.checkForQueryString(this.$route.query);
  },

  async mounted () {

    const prevRoute = this.$router.history.current.params;


    if (firebase.auth().currentUser !== null) {

      this.emailRecipientUserId = firebase.auth().currentUser.uid;
    }

    if (this.isQueryString && this.emailRecipientUserId.length) {

      if (prevRoute.from === 'AddRestaurant') {

        await this.handleRefundEmail();
      }
    }
  },

  methods: {

    async handleRefundEmail () {

      try {

          const refundEmailURL = process.env.VUE_APP_SEND_REFUND_EMAIL;

         const { emailResponse } = await this.sendCloudRequest(refundEmailURL);

         if (emailResponse === 'email sent') {

           this.refundEmailSent = true;
         }

      } catch (err) {

        console.log(err.message);
      }
    },

    async sendCloudRequest(url) {

        let response;


      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

        try {

          response = await axios(
            {
            method:'POST',
            url,
            headers: {
                      "content-type": "application/json",
                      "Accept": "application/json",
                      Authorization: `Bearer ${idToken}`
                     },

            data: {

              emailRecipientUserId: this.emailRecipientUserId,
            }
           }
          );
          const { body } = response.data;
          return body;

        } catch (err) {

          console.log(err.message);
        }
    },

    checkForQueryString(query) {

      for (let property in query) {

        if (property !== undefined && query[property] === 'complete') {

          this.isQueryString = true;
        }
      }
    }
  },
};
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;


.email-notification {
  text-align: center;
  color: $lightBlue;
  font-weight: bold;
}

.home-container {
  background-image: url('../assets/home-background.jpg');
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
}


</style>
