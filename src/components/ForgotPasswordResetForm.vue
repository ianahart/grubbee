
<template>
  <div class="forgot-password-form-container">
    <div class="forgot-password-form">
      <h1>Forgot Password</h1>
      <p>We will have you back in <span>Grubbee</span> in no time!</p>
      <p id="forgot-form-submit-error" v-if="formSubmitError.length">{{ formSubmitError }}</p>
      <p v-if="resetEmailSentText.length" id="email-sent-success-message">{{ resetEmailSentText }}</p>
      <!-- @submit.prevent="handleResetForm" -->
      <form @submit.prevent="sendResetFormEvent(formInputs.emailAddress.model)">
          <ForgotPasswordFormField
            :fieldData="formInputs.emailAddress"
            @inputchange="handleInputChange"
            @resetfield="handleResetField"
            :inputReset="inputReset"
          />
          <div class="forgot-password-btn-container">
            <button>Send Reset</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script>

  // import axios from 'axios';

  // import { firebase } from '@firebase/app';

  import ForgotPasswordFormField from './ForgotPasswordFormField.vue';

  export default {

    name: 'ForgotPasswordResetForm',

    props: {

      resetEmailSentText: String,
      resetFormResponseError: String,
      formInputs: Object,
    },

    components: {

      ForgotPasswordFormField,
    },

    data () {

      return {
        resetFormClean: false,
        inputReset: false,
        formSubmitError: '',
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

      resetFormResponseError: function () {

        if (this.resetFormResponseError) {

          this.formInputs.emailAddress.error = this.resetFormResponseError;
        } else {

          this.formInputs.emailAddress.error = '';
        }
      }

    },

    methods: {


      sendEvent (event, data) {

        this.$emit(event,
          {
            data,
          }
        );
      },

      sendResetFormEvent(email) {

            this.formSubmitError = '';

            this.prepareForm();

            if (this.resetFormClean) {

                this.$emit('sendreset', {
                  email
                });

            } else{

              this.formSubmitError = 'Please make sure there are no errors and the fields are filled out';
            }
      },

      handleResetField (payload) {

          const { marker } = payload.data;

          if(this.formInputs[marker]['error'].length) {

            this.inputReset = true;

            for (let property in this.formInputs[marker]) {

                if (property === 'error') {

                  this.sendEvent('errorchange1', '');
                }
            }
          } else {

            this.inputReset = false;
          }
      },

      handleInputChange (payload) {

        const { marker, model } = payload.data;

        this.updateFormState(marker, model);
      },

      updateFormState (marker, model) {

          for (let field in this.formInputs) {

              if (field === marker) {

                if (model.trim().length === 0) {

                  const error = this.assignErrorIfPresent(marker);

                  this.sendEvent('errorchange1', error);

                   this.sendEvent('modelchange1', model);
                } else {


                    this.sendEvent('modelchange1', model);
                }
              }
          }
      },

      assignErrorIfPresent (marker) {

        let error;

        if (marker === 'emailAddress') {

          error = 'Please provide an email address';
        }

        return error;
      },
      prepareForm () {

        this.resetFormClean = '';

        let filled = true;

        let errors = false;

        for (let field in this.formInputs) {

          for (let property in this.formInputs[field]) {

            if (property === 'error') {

              if (this.formInputs[field][property].length)

              errors = true
            }

            if (property === 'model') {

              if (this.formInputs[field][property].length === 0) {

                filled = false;
              }
            }
          }
        }

        if (filled && !errors) {

          this.resetFormClean = true;
        }
      },
    }
  }
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

@import url('https://fonts.googleapis.com/css2?family=Akaya+Telivigala&display=swap');

//****TRANSITIONS****/
// .fade-refund-modal-enter-active, .fade-refund-modal-leave-active {
//   transition: opacity .75s;
// }
// .fade-refund-modal-enter, .fade-refund-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
//****END TRANSITIONS****/

.forgot-password-form-container {
  width: 100%;
}

.forgot-password-btn-container,
.verification-btn-container {
  margin-top: 3rem;

  button {
    background-color: $blue;
    border: none;
    height: 35px;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    width: 120px;
    border-radius: 0.3rem;
    color: $offwhite;
    letter-spacing: 0.085rem;

    &:hover {
      opacity: 0.7;
    }
  }
}

#forgot-form-submit-error {

  color: darken($red, 5);
  font-weight: bold;
  font-size: 0.85rem;
}

#email-sent-success-message {
  color: lighten(green, 10);
  font-weight: bold;
  font-size: 0.85rem;
}


.forgot-password-form {
  width: 85%;
  background-color: #fff;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  form {
    width: 100%;
  }

  h1 {
    color: darken($lightBlue, 5);
  }

  p {
    color: lighten($black, 5);

    span {
       font-family: 'Akaya Telivigala', cursive;
       font-weight: bold;
       color: $blue;
    }
  }
}

@media (max-width: 600px) {
  .forgot-password-form {

    form {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  }

  .forgot-password-btn-container {
    text-align: center;
  }
}


</style>