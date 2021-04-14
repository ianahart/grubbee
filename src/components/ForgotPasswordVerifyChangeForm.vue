
<template>
  <div class="forgot-password-form-container">
    <div class="forgot-password-form">
      <h1>Verify and Update Your Password</h1>
      <p>One more step in order to reset your password for your <span>Grubbee</span> account</p>
      <p id="forgot-form-submit-error" v-if="formSubmitError.length">{{ formSubmitError }}</p>
      <!-- <p v-if="resetEmailSentText.length" id="email-sent-success-message">{{ resetEmailSentText }}</p> -->
      <!-- @submit.prevent="handleResetForm" -->
      <form @submit.prevent="sendVerifyChangeForm(formInputs)">
          <ForgotPasswordFormField
            :fieldData="formInputs.verificationCode"
            @inputchange="handleInputChange"
            @resetfield="resetField"
          />
          <p class="verify-form-input-divider">&nbsp;</p>
          <ForgotPasswordFormField
            :fieldData="formInputs.newPassword"
            @inputchange="handleInputChange"
            @resetfield="resetField"
          />
          <div class="forgot-password-btn-container">
            <button>Make Change</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script>

  import ForgotPasswordFormField from './ForgotPasswordFormField.vue';

  export default {

    name: 'ForgotPasswordVerifyChangeForm',

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
        isFormValid: false,
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {


    },

    methods: {

      sendEvent (event, data) {

        this.$emit(event,
          {
            data,
          }
        );
      },

      resetField ({ data }) {

        const { marker } = data;

        if (this.formInputs[marker]['error'].length) {

          this.sendEvent('clearerror', marker);
        }
      },

      handleInputChange ( {data }) {

        const modelInput = {};

        const { marker, model } = data;

        for (let field in this.formInputs) {

            if (field === marker) {

              if (model.trim().length <= 0) {

                const fieldError =  marker === 'verificationCode' ? 'verification code' : 'password';

                const error = {[marker]: `Please fill out the ${fieldError} field`};

                this.sendEvent('errorchange2', error);

                modelInput[marker] = model;

                this.sendEvent('modelchange2', modelInput);
              } else {

                modelInput[marker] = model;

                this.sendEvent('modelchange2', modelInput);
              }
            }
        }
      },

      sendVerifyChangeForm (form) {

        this.formSubmitError = '';

        this.validateFormForSubmit();

        if (this.isFormValid) {

          this.sendEvent('sendverifychange', form);
        } else {

          this.formSubmitError = 'Please make sure there are no errors and the fields are filled out';
        }
      },

      validateFormForSubmit () {

        let filled= true;

        let errors = false;

        for (let field in this.formInputs) {

          for (let property in this.formInputs[field]) {

            if (property === 'error') {

              if (this.formInputs[field][property].length) {

                errors = true;
              }
            }

            if (property === 'model') {

              if (this.formInputs[field][property].length === 0) {

                filled = false;
              }
            }
          }
        }

        if (filled && !errors) {

          this.isFormValid = true;
        } else {

          this.isFormValid = false;
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


.verify-form-input-divider {

  margin: 3rem 0;
}

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


    .verify-form-input-divider {

      margin: 1rem 0;
    }


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