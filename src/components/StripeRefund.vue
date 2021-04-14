<template>
  <div>
    <div v-if="isRefundAvailable" class="stripe-refund-container">
      <StripeRefundModal
        @modalaction="handleModalAction"
        :firstName="firstName"
        :isModalOpen="isModalOpen"
      />
      <div
        class="refund-button"
        v-if="!isModalOpen && !refundClicked"
      >
          <div
          :class="`popup-refund-message ${revealMessage}`"
          v-if="!isModalOpen"
          >
            <p>Not satisfied with your experience on Grubbee?</p>
            <p>Let us offer you a full refund inside a one week window</p>
          </div>
          <button
            @click="triggerModal"
            @mouseover="showMessage"
            @mouseout="hideMessage"
          >
            <img src="../assets/credit-card.svg" alt="a credit card"/>
            Get Refunded
          </button>
      </div>
    </div>
     <div v-if="refundClicked" class="refund-spinner-container">
       <p>Please wait while your refund is being processed...</p>
        <Spinner />
      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { firebase } from '@firebase/app';

  import StripeRefundModal from './StripeRefundModal.vue';
  import Spinner from './Spinner.vue';

  export default {

    name: 'StripeRefund',

    components: {
      StripeRefundModal,
      Spinner,
    },

    props: {
      firstName: String,
      currentUserId: String,
    },

    data () {

      return {
        isMessageShowing: null,
        isModalOpen: false,
        isRefundAvailable: false,
        refundSuccess: null,
        refundClicked: false,
      }
    },

    async created () {

      await this.determineRefundAvailable();
    },

    mounted () {


    },

    computed: {

      revealMessage: function () {

        return this.isMessageShowing ? 'visible' : 'invisible';

      }
    },



    methods: {

      showMessage() {


        this.isMessageShowing = true;
      },

      hideMessage() {


        this.isMessageShowing = false;
      },

      triggerModal () {

        this.isModalOpen = true;

        this.isMessageShowing = false;
      },

      handleModalAction ({ action }) {

          if (action === 'accept') {

              this.refundUser();
          }

          if (action === 'deny') {

            this.cancelRefundUser();
          }
      },

      async refundUser () {

        this.refundClicked = true;


        this.isModalOpen = false;

        if (!this.isModalOpen) {

          const functionURL = process.env.VUE_APP_STRIPE_REFUND;

          await this.makeCloudRequest(functionURL);

          if (this.refundSuccess !== null || this.refundSuccess !== false) {

              this.$router.push(
                {
                  name: 'Home',
                  params: { from: 'AddRestaurant'},
                  query: {refund: 'complete'}
                }
              );
          }
        }
      },


      async makeCloudRequest (url) {

        let response;

        const idToken = await firebase
        .auth()
        .currentUser
        .getIdToken(true);


        try {
          response = await axios(
            {
              method: 'POST',
              url,
              headers: {
                        "content-type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${idToken}`

                       },
              data: {
                currentUserId: this.currentUserId,
              },
            }
          );

          const result = response.data.body;

          if (result.trigger === 'determineToShowRefund') {

             if (result.data.refundAvailable) {

               this.isRefundAvailable = true;

             } else {

               this.isRefundAvailable = false;
             }
          }

        if (result.trigger === 'stripeRefund') {

          if (result.data) {

            this.refundSuccess = true;
          } else {

            this.refundSuccess = false;
          }
        }

        } catch (err) {

          console.log(err, err.message);
        }

      },

      cancelRefundUser () {

        this.isModalOpen = false;
      },

      async determineRefundAvailable () {

          const functionURL = process.env.VUE_APP_DETERMINE_REFUND;

          await this.makeCloudRequest(functionURL);
      },
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



.stripe-refund-container {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1.5rem;
  border-bottom: 1px solid lighten($gray, 1);
}

.refund-spinner-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  flex-direction: column;
  align-items: center;

  p {
    color: darken($gray, 15);
  }
}

.invisible {
  visibility: hidden;
   opacity: 0;
  transition: all 0.5s ease-in-out;
}

.visible {
  visibility: visible;
  opacity: 1;
  transition: all 0.5s ease-in-out;
}

.popup-refund-message {
  margin-bottom: 0.5rem;
}



.refund-button {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-left: 1.5rem;
  margin-bottom: 2rem;

    button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    background-color: darken(darkgray, 5);
    color: $offwhite;
    border: none;
    border-radius: 7px;
    height: 40px;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darkgray;
      border-radius: 2px;
    }

    img {
      margin-right: 0.3rem;
    }
  }
}

@media(max-width: 600px) {

  .stripe-refund-container {
    text-align: center;
    margin: 0;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
  }

  .invisible {
    visibility: visible;
    opacity: 1;
  }

  .refund-button {
  margin-left: 0;
  padding: 0 0.5rem;
  margin-bottom: 2rem;
  }
}

</style>