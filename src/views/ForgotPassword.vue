<template>
  <div class="forgot-password-container">
    <ForgotPasswordHeader />
    <p id="token-error" v-if="tokenError.length">{{ tokenError }}</p>
    <p id="success-message" v-if="passwordChangedMsg.length">{{ passwordChangedMsg }}</p>
    <p id="password-update-error" v-if="passwordUpdateError.length">{{ passwordUpdateError }}</p>
    <button v-if="tokenError.length" @click="restartProcess" class="restart-reset-process-link">Try Again</button>
    <ForgotPasswordResetForm
      v-if="!verificationForm"
      @sendreset="handleResetForm"
      :resetEmailSentText="resetEmailSentText"
      :resetFormResponseError="resetFormResponseError"
      @modelchange1="handleFirstStepModelChange"
      @errorchange1="handleFirstStepErrorChange"
      :formInputs="resetFormInputs"
    />

    <ForgotPasswordVerifyChangeForm
      v-if="verificationForm && !tokenError.length"
      :formInputs="verificationFormInputs"
      @modelchange2="handleLastStepModelChange"
      @errorchange2="handleLastStepErrorChange"
      @clearerror="clearVerifyChangeError"
      @sendverifychange="handleVerifyAndUpdateForm"
    />

  </div>
</template>

<script>


import axios from 'axios';

import ForgotPasswordHeader from '../components/ForgotPasswordHeader.vue';
import ForgotPasswordResetForm from '../components/ForgotPasswordResetForm.vue';
import ForgotPasswordVerifyChangeForm from '../components/ForgotPasswordVerifyChangeForm.vue';


  export default {

    name: 'ForgotPassword',

    props: {

    },

    components: {

      ForgotPasswordHeader,
      ForgotPasswordResetForm,
      ForgotPasswordVerifyChangeForm,
    },

    data () {

      return {

        resetEmailSentText: '',
        verifyChangeResponseError: '',
        passwordUpdateError: '',
        passwordChangedMsg: '',
        redirectTimerID: '',
        userId: '',
        tokenIsValid: null,
        tokenError: '',
        resetFormResponseError: '',
        verificationForm: false,
        resetFormInputs: {

          emailAddress: {
              marker: 'emailAddress',
              label: 'Your Email:',
              model: '',
              error: '',
          }
        },

        verificationFormInputs: {

          verificationCode: {
            marker: 'verificationCode',
            model: '',
            error: '',
            label: 'Your verification code:'
          },

          newPassword: {
            marker: 'newPassword',
            model: '',
            error: '',
            label: 'Enter a password:',
          },
        },
      }
    },

    created () {

    },

    async mounted() {

      if(this.$route.query.token) {

        const { token } = this.$route.query;

        this.verificationForm = true;

        await this.checkIfTokenIsValid(token);
      }
    },

    beforeDestroy() {

      clearTimeout(this.redirectTimerID);
    },

    methods: {

      restartProcess () {

        this.userId = '';

        this.tokenIsValid = null;

        this.tokenError = '';

        this.resetFormResponseError = '';

        this.verificationForm = false;

        this.$router.push('/forgotpassword');
      },



      async checkIfTokenIsValid  (token)  {

        try {

          const requestData = {

            resetToken: token,

          };

          const method = 'POST';

          const FIREBASE_URL = process.env.VUE_APP_CHECK_RESET_PASSWORD_TOKEN;

          const responseData = await this.sendFirebaseRequest(FIREBASE_URL, method, requestData);

          const { isValid, userId } = responseData.data.body.data;

          if (responseData.status === 200) {

              this.tokenIsValid = isValid;

              this.userId = userId;
          }

          if (responseData.status >= 400 && responseData.status <= 599) {

            this.tokenIsValid = isValid;

            this.userId = userId;

            this.tokenError = responseData.data.body.errorMessage;
          }

        } catch (err) {

          console.log('Error', err);

          console.log('Error Response: ', err.response);

        }

      },

      clearVerifyChangeError ({ data }) {
            console.log(data);
        for (let property in this.verificationFormInputs[data]) {

          if (property === 'error' || property === 'model') {

            this.verificationFormInputs[data]['error'] = '';

          }
        }
      },

      handleLastStepModelChange ({ data }) {

        this.updateFormState(data, 'model');
      },

      handleLastStepErrorChange ({ data }) {

        this.updateFormState(data, 'error');
      },

      updateFormState (form, property) {

        const marker = Object.keys(form).join('');

        const value = Object.values(form).join('');

        for (let field in this.verificationFormInputs) {

          if (field === marker) {

            this.verificationFormInputs[field][property] = value;
          }
        }
      },

      handleFirstStepModelChange ({ data }) {

        this.resetFormInputs.emailAddress.model = data;
      },

      handleFirstStepErrorChange ({ data }) {

        this.resetFormInputs.emailAddress.error = data;
      },


      handleResetFormResponseErrors (errors, status) {

        if (status === 400 || status === 404) {

          this.resetFormResponseError = errors.email;
        }
      },

      async sendFirebaseRequest (url, method, data) {

        let response;

        try {

          response = await axios(
            {
              url,
              method,
              headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              data,
            }
          );
          const requestedData = response;

         return requestedData;

        } catch (err) {

             return err.response;
        }

      },

      async sendResetPassword (userEmail) {

        let responseData;

        try {

            const FIREBASE_URL= process.env.VUE_APP_FORGOT_PASSWORD_EMAIL;

            const method = 'POST';

            const requestData = {

              appURL: location.origin + this.$route.path,

              userEmail,
            };

            responseData = await this.sendFirebaseRequest(FIREBASE_URL, method, requestData);


            if (responseData.status >= 400 && responseData.status <= 599) {

                const { errors } = responseData.data.body;

                this.handleResetFormResponseErrors(errors, responseData.status);

            }

            if (responseData.status === 200) {

               const { successMessage, userId } = responseData.data.body;

               this.resetEmailSentText = successMessage;

               this.userId = userId;
            }

        } catch (err) {

            console.log('Error: ', err);

            console.log('Error Message: ', err.message);

            console.log('Error Response: ', err.response);
        }
      },

      async handleResetForm ({ email }) {

          try {

              await this.sendResetPassword(email);

          } catch (err) {

            console.log('Error: ', err);

            console.log('Error Message: ', err.message);

            console.log('Error Response: ', err.response);
          }
      },

      async handleVerifyAndUpdateForm (payload) {


        try {
              const { data } = payload;

            const FIREBASE_URL = process.env.VUE_APP_VERIFY_AND_CHANGE_PASSWORD;

            const method = 'POST';

            const requestData = {

              userId: this.userId,

              form: data,
            };

            const responseData = await this.sendFirebaseRequest(FIREBASE_URL, method, requestData);

            if (responseData.status >= 400 && responseData.status <= 599) {

                const { errorMessage, errorLocation } = responseData.data.body;

                if (responseData.status === 401) {

                  this.verificationFormInputs[errorLocation]['error'] = errorMessage;
                }

                if (responseData.status === 400) {

                  this.verificationFormInputs[errorLocation]['error'] = errorMessage;
                }

                if (responseData.status === 422) {

                  this.passwordUpdateError = errorMessage;
                }
            }

          if (responseData.status === 200) {

            const { successMessage } = responseData.data.body;

            this.passwordChangedMsg = successMessage;

            this.redirectTimerID = setTimeout(
              () => {

              this.$router.push({ name: 'Login' });
            }, 3000);
          }

        } catch (err) {

          console.log('Error: ', err);

          console.log('Error Message: ', err.message);

          console.log('Error Response: ', err.response);

        }
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

//****TRANSITIONS****/
// .fade-refund-modal-enter-active, .fade-refund-modal-leave-active {
//   transition: opacity .75s;
// }
// .fade-refund-modal-enter, .fade-refund-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
//****END TRANSITIONS****/
.restart-reset-process-link{
  text-align: center;
  display: block;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  color: $lightBlue;
}

.forgot-password-container {
  background-color: $gray;
  height: 100%;
  width: 100%;
}

#token-error,
#password-update-error {
  font-size: 1rem;
  color: darken($red, 5);
  font-weight: 900;
  text-align: center;
}


#success-message {
  font-size: 1rem;
  color: lighten(green, 5);
  font-weight: 900;
  text-align: center;
}


</style>