<template>
  <div class="stripe-container">
      <h2><span class="number-step">2</span> Payment</h2>
      <div class="payment-total">
        <div class="total-underline"></div>
        <div class="total-row">
          <p>Total:</p>
          <p>$10.00</p>
        </div>
      </div>
      <h3>Secured with <i class="fab fa-stripe"></i></h3>

      <div class="billing-name-on-card">
        <label>Name On Card:</label>
        <input :id="focusName" ref="cardName" @keyup="sendNameChange(nameInput)" type="text" v-model="nameInput"/>
        <transition name="fade-error" appear>
          <p v-if="cardHolderError">{{ cardHolderError }}</p>
        </transition>
      </div>
      <div class="flex-card">
        <div :id="focusCard" class="stripe-card" ref="card">
      </div>
      <transition name="fade-error" appear>
        <p v-if="cardInfoError">{{ cardInfoError }}</p>
      </transition>
    </div>
  </div>
</template>


<script>

  export default {
     name: 'StripePayment',


     components: {

     },

     props: {

       stripeTrigger: Boolean,
       cardHolder: String,
       cardInfoError: String,
       cardHolderError: String,
       isPaymentCompShowing: Boolean,
       tokenMetaData: Object,

     },

     data () {

       return {

         stripe: '',
         stripeElements: '',
         card: undefined,
         nameInput: '',
         isCardFocus: false,
         isNameFocus: false,
       }
     },

     created () {

     },


     mounted () {

       this.initStripe();

       this.card.addEventListener('focus', this.setFocus);

       this.card.addEventListener('blur', this.removeFocus);

       this.$refs.cardName.addEventListener('focus', this.setFocus);

       this.$refs.cardName.addEventListener('blur', this.removeFocus);

     },

     beforeDestroy() {

        this.card.destroy(this.$refs.card);

       this.card.removeEventListener('focus', this.setFocus);

       this.card.removeEventListener('blur', this.removeFocus);

       this.$refs.cardName.removeEventListener('focus', this.setFocus);

       this.$refs.cardName.removeEventListener('blur', this.removeFocus);

    },


     watch: {

       stripeTrigger: function () {

         this.purchase();
       },

     },

     computed: {

      focusName: function () {

         return   this.isNameFocus === true ? 'focus-name' : ''

      },

      focusCard: function ()  {

        return this.isCardFocus === true ? 'focus-card' : ''
      }
    },

     methods: {



       sendNameChange (cardHolder) {

         this.$emit('change', {

           cardHolder,
         });
       },

       initStripe () {

         const cardStyles = {
             style: {
                base: {
                  iconColor: '#c4f0ff',
                  color: '#293241',
                  fontWeight: 500,
                  fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                  fontSize: '16px',
                  fontSmoothing: 'antialiased',
                  ':-webkit-autofill': {
                    color: '#fce883',
                  },
                  '::placeholder': {
                    color: '#45aebf',
                  },
                },
              invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
              },
          },
         };

        this.stripe = window.Stripe(`${process.env.VUE_APP_STRIPE_PUBLISH_KEY}`);

        this.stripeElements = this.stripe.elements();

        this.card = this.stripeElements.create('card', cardStyles);

        this.card.mount(this.$refs.card);

        this.setupCardListener();

       },

       setFocus (e) {

         if (e.elementType) {

           this.isCardFocus = true;

         } else if (e.target) {

           this.isNameFocus = true;

         }
       },

       removeFocus (e) {

        if (e.elementType) {

         this.isCardFocus = false;

        } else if (e.target) {

          this.isNameFocus = false;

        }
       },



       setupCardListener () {

         let isCardInfoFilled = false;

         let error = '';

          this.card.on('change', (event) => {

          if (event.complete) {

              isCardInfoFilled = true;

              this.$emit('cardcomplete', {

                isCardInfoFilled,

                error,
              });

          } else if (event.error) {

             error = event.error;

            isCardInfoFilled = false;

            this.$emit('cardcomplete', {

              error,

              isCardInfoFilled,
            });
          }
        });
       },

       async purchase () {

       const cardOptions = {

         currency: 'usd',
         name: this.cardHolder,
         address_line1: this.tokenMetaData.address.model,
         address_city: this.tokenMetaData.city.model,
         address_state: this.tokenMetaData.state.model,
         address_zip: this.tokenMetaData.zipCode.model,
         address_country: 'US',

       }

       const paymentRequestOptions = {

        country: 'US',
        currency: 'usd',
        total: {
          label: 'Restaurant sign up fee',
          amount: 10.00,
        },
        requestPayerName: true,
        requestPayerEmail: true,

       }

       const paymentRequest =  await this.stripe.paymentRequest(paymentRequestOptions);

       const token =  await this.stripe.createToken(this.card, cardOptions);



       this.$emit('transaction', {

         paymentRequest,

         token,
       });
       }
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


/****TRANSITIONS****/
.fade-error-enter-active, .fade-error-leave-active {
  transition: all  .7s ease-in-out;

}

.fade-error-enter, .fade-error-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
/****END TRANSITIONS****/

  #focus-name {
   border: 2px solid lighten($lightBlue, 10);
   transition: all 0.3s ease-in-out;
  }

  #focus-card {
   border: 2px solid lighten($lightBlue, 10);
   transition: all 0.3s ease-in-out;
  }


.payment-total {
  width: 90%;
  margin: 0 auto;
}

.total-underline {
  height: 2px;
  background-color: darken($gray, 9);
  width: 30%;
}

.total-row {
  display: flex;
  justify-content: space-between;
  width: 30%;
  color: $black;
  font-style: italic;
}

.number-step {
  display: block;
  color: $lightBlue;
  border: 2px solid darken($lightBlue, 10);
  border-radius: 50%;
  padding: 0.3rem;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.stripe-container {
  margin: 3rem auto;
  width: 100%;

  h2 {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    color: lighten(darkslategrey, 5);

  }

  h2, h3 {
     width: 90%;
  }

  h3 {
    margin: 0.5rem auto;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: darken($gray, 10);
    font-style: italic;

    i {
      margin-left: 0.5rem;
      font-size: 2rem;
      color: $offwhite;
      padding: 0.2rem 0.5rem;
      background: linear-gradient(90deg, rgba(238,108,77,1) 0%, rgba(100,9,121,1) 35%, rgba(0,108,255,1) 100%);
    }
  }
}

.stripe-form {
  width: 50%;
  margin: 0 auto;
}

.stripe-card {
  border: 1px solid $gray;
  width: 85%;
  border-radius: 5px;
  margin: 0 auto;
  padding: 1rem;

}

.flex-card {
  margin-top: 3rem;
  p {
    color: $red;
    font-size: 0.9rem;
    text-align: center;
}
}

@media(max-width: 630px) {

  .stripe-container {
    width: 90%;

    h3 {
      justify-content: center;
    }
  }

  .payment-total {
    text-align: center;
  }

  .total-row {
    width: 100%;
  }

  .total-underline {
    width: 100%;
  }
}


</style>


