<template>
  <div
    v-if="dataIsLoaded"
    class="payment-confirmation"
  >
    <PaymentConfirmationSucess
      v-if="!errorMessage.length"
      :errorMessage="errorMessage"
      :currentUserName="currentUserName"
      :currentUserEmail="currentUserEmail"
    />
    <PaymentConfirmationError
      v-if="errorMessage.length"
      :errorMessage="errorMessage"
      :currentUserName="currentUserName"
    />
  </div>
  <div
  class="confirmation-loader-container"
  v-else
  >
    <Spinner />
  </div>
</template>

<script>
  import { firebase } from '@firebase/app';
  import axios from 'axios';

  import PaymentConfirmationSucess from '../components/PaymentConfirmationSucess.vue';
  import PaymentConfirmationError from '../components/PaymentConfirmationError.vue';
  import Spinner from '../components/Spinner.vue';
  export default {

    name: 'RestaurantPaymentConfirmation',

    components: {

      PaymentConfirmationSucess,
      PaymentConfirmationError,
      Spinner,
    },

    props: {

    },

    data () {

      return {
        db: firebase.firestore(),
        currentUserId: firebase.auth().currentUser.uid,
        currentUserName: '',
        currentUserEmail: '',
        dataIsLoaded : false,
        errorMessage: '',
      }
    },

    created () {

    },

    async mounted () {

      await this.getUserInformation();
    },

    methods: {

      async sendConfirmationEmail () {

        let result;

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

        try {

          result = await axios(
            {
              method: 'POST',
              url: process.env.VUE_APP_SEND_CONFIRMATION_EMAIL,
              headers:{
                        "content-type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${idToken}`

                      },
              data: {
                      currentUserId: this.currentUserId,
                      currentUserName: this.currentUserName,
                      currentUserEmail: this.currentUserEmail,
                      action: 'sendEmail',
              }
            },
          )

          const { data } = await result.data;

          await this.configureData(data);

          if (data) {

            this.dataIsLoaded = true;
          }
        } catch (err) {

          this.errorMessage = err.message;
        }

      },

      async getUserInformation () {

        let result;

          const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

          try {

                result =  await axios(
                  {
                  method: 'POST',
                  url: process.env.VUE_APP_GET_USER_INFORMATION,
                  headers: {
                            "content-type": "application/json",
                            "Accept": "application/json",
                            Authorization: `Bearer ${idToken}`

                           },
                  data: {
                          currentUserId: this.currentUserId,
                          action: 'userInformation',
                        }
                  }
                )

                const { data } = await result.data;

                await this.configureData(data);

          } catch (err) {

            this.errorMessage = err.message;
          }
      },

     async configureData (data) {

        if (data.statusCode === 500) {

            this.errorMessage = data.errorMessage;

            if (this.errorMessage.length) {

              this.dataIsLoaded = true;
            }
        }

        if (data.statusCode === 200) {

            if (data.action === 'userInformation') {

                 this.currentUserName = data.data.firstName;

                 this.currentUserEmail = data.data.email;

                  await this.sendConfirmationEmail();
                console.log('userInformation function');
            } else if (data.action === 'sendEmail') {
                console.log('sendEmail function');
            }
        }
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


.payment-confirmation {
  background: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('../assets/paymentconfirmation.jpg');
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.confirmation-column,
.payment-confirmation-error {
  background-color: $gray;
  width: 70%;
  padding: 1rem;
  margin: 0 auto;
  border-radius: 0.25rem;
}

.confirmation-box-container,
.payment-confirmation-error-container {
  header {
    text-align: center;
    h2 {
      margin: 0;
    }
    p {
      line-height: 1.6;
      color: $black;
      &:first-of-type {
        text-align: left;
      }
    }

    span {
      color: $lightBlue;
      font-weight: bold;
      font-style: italic;
    }
  }
}

.home-link-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;

  a {
    color: $lightBlue;
    text-decoration: none;
    transition: all 0.5s ease-in-out;

    &:hover {
      color: $blue;

    }
  }
}

.confirmation-loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
}

.confirmation-image-container {
 width: 200px;
 border-radius: 50%;
 height: 200px;
 margin: 0 auto;
 overflow: hidden;
 display: flex;
 justify-content: center;
 align-items: center;
  img {
    height: 300px;
    width: 300px;
  }
}

@media(max-width:600px) {

  .confirmation-column,
  .payment-confirmation-error {
    height: 90%;
  }

  .confirmation-image-container {
    height: 100px;
    width: 100px;
    img {
      height: 150px;
      width: 150px;
    }
  }
}
</style>