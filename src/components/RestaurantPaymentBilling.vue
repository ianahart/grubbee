<template>
  <div class="restaurant-payment-billing">
    <div v-if="isPaymentCompShowing" @click.prevent="handleSectionShowing" class="restaurant-payment-back-btn">
      <i class="fas fa-arrow-up"></i>
      <p>Billing Address</p>
    </div>
    <form @submit.prevent="handleFormSubmit" autocomplete="off">
      <transition name="fade-forms" appear>
        <PaymentBillingInformation
            @showPayment="handleShowPayment"
            v-if="!isPaymentCompShowing"

          />
      </transition>
      <transition name="fade-forms" appear>
        <StripePayment
            v-if="isPaymentCompShowing"
            :stripeTrigger="stripeTrigger"
            :cardHolder="billingForm.cardHolder"
            :cardInfoError="billingForm.cardInfoError"
            :cardHolderError="billingForm.cardHolderError"
            :tokenMetaData="tokenMetaData"
            @transaction="handleTransaction"
            @change="setCardHolder"
            @cardcomplete="handleCardStatus"
          />
      </transition>
      <div class="spinner-container" v-if="completeButtonClicked && !transactionMessage.length">
        <Spinner />
      </div>
       <div class="transaction-message">
          <p :class="transactionMsg"><i v-if="transactionMessage" class="fas fa-info-circle"></i> {{ transactionMessage }}</p>
      </div>
      <transition name="slide-submit" appear>
        <div
          v-if="billingForm.cardHolder.length && billingForm.isCardFilled && !billingForm.cardHolderError && !billingForm.cardInfoError"
          class="payment-btn-container">
          <button type="submit">Complete Payment</button>
        </div>
      </transition>
    </form>
  </div>
</template>




<script>
import axios from 'axios';
import { firebase } from '@firebase/app';

import StripePayment from './StripePayment';
import PaymentBillingInformation from './PaymentBillingInformation';
import Spinner from './Spinner';

  export default {

    name: 'RestaurantPaymentBilling',

    props: {

    },

    components: {

      StripePayment,
      PaymentBillingInformation,
      Spinner,
    },

    data () {

      return {
        db: firebase.firestore(),
        billingForm: {
          stripeToken: '',
          stripePaymentRequest: '',
          cardHolder: '',
          cardHolderError: '',
          isCardFilled: '',
          cardInfoError: '',
        },
        pendingID: '',
        timerID: '',
        tokenMetaData: null,
        stripeTrigger: false,
        isPaymentCompShowing: false,
        userid: firebase.auth().currentUser.uid,
        transactionMessage: '',
        transactionError: false,
        completeButtonClicked: false,
        transactionTimeout: null,
        currentUserId: firebase.auth().currentUser.uid,
      }
    },

    created () {

    },

    mounted () {

      this.pendingID = this.$route.query.pending;
    },

    beforeDestroy () {

      clearTimeout(this.transactionTimeout);
      clearTimeout(this.timerID);
    },

    computed: {
      transactionMsg: function () {
        return {

          'transaction-success' : this.transactionError === false,

          'transaction-error' : this.transactionError === true,
        }
      }
    },

    methods: {

        handleSectionShowing () {

            this.billingForm.isCardFilled = false,

            this.isPaymentCompShowing = false;
        },

        handleShowPayment({ nextState, bool }) {

          this.tokenMetaData = nextState;

          this.isPaymentCompShowing = bool;
        },

        handleCardStatus ({ isCardInfoFilled, error }) {

            this.billingForm.isCardFilled = isCardInfoFilled;

            if (this.billingForm.isCardFilled) {

              this.billingForm.cardInfoError = '';
            }   else {

                this.billingForm.cardInfoError = error.message;
            }
        },

        setCardHolder ({ cardHolder }) {

          this.billingForm.cardHolder = cardHolder;

          this.validateCardHolder(cardHolder);
        },

        validateCardHolder (name) {

          const nameRegex = /^[a-zA-Z ]+$/;

          if (name.length > 50) {

            this.billingForm.cardHolderError = 'Name must be maximum of 50 characters';
          } else if (!nameRegex.test(String(name).toLowerCase())) {

            this.billingForm.cardHolderError = 'Name must be of letters only';
          } else {

            this.billingForm.cardHolderError = '';
          }
        },

        handleFormSubmit () {

          this.stripeTrigger = !this.stripeTrigger;

        },


        async handleTransaction ({ paymentRequest, token }) {


           this.transactionError = false;

           this.transactionMessage = '';


          clearTimeout(this.transactionTimeout);

          this.completeButtonClicked = true;

          let result;

         const FIREBASE_FUNCTION_CHARGE = process.env.VUE_APP_CHARGE_FUNCTION;

          this.billingForm.stripePaymentRequest = paymentRequest,

          this.billingForm.stripeToken = token;


          const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

          try {
             result = await axios ({
                        method: 'POST',
                        url: FIREBASE_FUNCTION_CHARGE,
                        headers: {
                            "content-type": "application/json",
                            "Accept": "application/json",
                            Authorization: `Bearer ${idToken}`

                        },
                        data: {

                          token: this.billingForm.stripeToken,

                          pendingid: this.pendingID,

                          userId: this.currentUserId,

                        }
                      });

                      const  data  = await result;

                      if (data.data.body.statusCode === 200) {

                            this.transactionError = false;

                            await this.sendAddRestaurant();

                            this.transactionMessage = data.data.body.message;

                            this.transactionTimeout = setTimeout(() => {

                            this.$router.push({ name: 'RestaurantPaymentConfirmation' });

                          }, 1000);

                        } else if (data.data.body.statusCode === 500) {

                            this.transactionError = true;

                            this.transactionMessage = data.data.body.message;

                           this.timerID = setTimeout(
                              () => {
                              this.$router.push('/');
                            },2500);
                        }

          }
          catch (err) {

            console.log(err.message);
          }
        },

        async sendAddRestaurant() {

          const FIREBASE_FUNCTION_ADD_RESTAURANT = process.env.VUE_APP_ADD_RESTAURANT_FUNCTION;

          let result;

          const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

          try {
            result = await axios({
                        method: 'POST',
                        url: FIREBASE_FUNCTION_ADD_RESTAURANT,
                        headers: {
                            "content-type": "application/json",
                            "Accept": "application/json",
                            Authorization: `Bearer ${idToken}`
                        },
                        data: {
                          pendingid: this.pendingID,
                          userid: this.userid,
                        }
            });

             await result;

          } catch (err) {

            console.log(err);
          }



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

//****TRANSITIONS****/
.slide-submit-enter-active, .slide-submit-leave-active {
  transition: all 0.7s;
}


.slide-submit-enter, .slide-submit-leave-to {
  opacity: 0;
  transform:translateX(-100px);
}



.fade-forms-enter-active, .fade-forms-leave-active {
  transition: all 0.7s;
}


.fade-forms-enter, .fade-forms-leave-to {
  opacity: 0;
  transform:translateX(-50px);
}

//****END TRANSITIONS****/

.spinner-container {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}

.transcation-message {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.transaction-error {
  color: $red;
  text-align: center;
}

.transaction-success {
  color: green;
  text-align: center;
}

.restaurant-payment-back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 130px;

  i {
    margin-right: 0.5rem;
  }


    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      color: $blue;
      transform:scale(1.05);
    }

}


.restaurant-payment-billing {
  width: 70%;
  margin: 3rem auto;
}

.restaurant-payment-billing form {
    border: 1px solid $gray;
    width: 100%;
    border-radius: 5px;
}

.payment-btn-container {
  margin: 2rem auto;
  display: flex;
  justify-content: flex-end;

  button {
    margin-right: 1rem;
    cursor: pointer;
    padding: 0.3rem 0.4rem;
    height: 30px;
    border-radius: 5px;

    transition: all 0.5s ease-in-out;
    background-color: $gray;
    border: none;
    &:hover {
      background-color: darken($gray, 10);
    }
  }
}

@media(max-width: 630px) {

  .restaurant-payment-billing {
    width: 90%;
  }

  .payment-btn-container {
    justify-content: center;

    button {
      margin: 0;
    }
  }
}

</style>