<template>
  <div class="change-password-form-container">
    <ChangePasswordModal
      :isModalOpen="isModalOpen"
      @accept="handlePasswordChange"
      @deny="cancelPasswordChange"
    />
    <div class="change-password-form-title">
      <h1>Change your password</h1>
      <p v-if="!internalError.length">A strong password helps to prevent unauthorized access to your grubbee account</p>
      <p id="internal-error" v-if="internalError.length">{{ internalError }}</p>
    </div>
    <form @submit.prevent="openModal" class="change-password-form">
      <ChangePasswordFormField
          :fieldData="formInputs.currentPassword"
          @inputchange="captureInputs"
          @reset="resetInput"
          :formValuesCancelled="formValuesCancelled"
      />
      <ChangePasswordFormField
          :fieldData="formInputs.newPassword"
          @inputchange="captureInputs"
          @reset="resetInput"
          :formValuesCancelled="formValuesCancelled"
      />
      <ChangePasswordFormField
          :fieldData="formInputs.confirmPassword"
          @inputchange="captureInputs"
          @reset="resetInput"
          :formValuesCancelled="formValuesCancelled"
      />
      <p class="password-updated-success-msg">{{ passwordUpdatedMsg }}</p>
      <div class="change-password-btns">
        <button>Save</button>
        <button @click.prevent="resetFormFields">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>

import axios from 'axios';
import { firebase } from '@firebase/app';

import ChangePasswordModal from './ChangePasswordModal.vue';
import ChangePasswordFormField from './ChangePasswordFormField.vue';


  export default {

    name: 'ChangePasswordForm',

    props: {
      currentUserId: String,
      currentUserEmail: String,
      currentUser: Object,
    },

    components: {

      ChangePasswordModal,
      ChangePasswordFormField,
    },

    data () {

      return {

        isModalOpen: false,
        formValuesCancelled: false,
        resetTimerID: '',
        redirectTimerID: '',
        isUserReAuthenticated: '',
        internalError: '',
        passwordUpdatedMsg: '',


        formInputs: {
            // marker prop used to distinguish the inputs coming through to respond accordingly
          currentPassword: {
            marker: 'currentPassword',
            label: ' Current password',
            model: '',
            error: '',
          },

          newPassword: {
            marker: 'newPassword',
            label: 'New password',
            model: '',
            error: '',
          },

          confirmPassword: {
            marker: 'confirmPassword',
            label: 'Re-enter password',
            model: '',
            error: '',
          },
        },
      }
    },

    created () {


    },

     mounted () {

    },

    beforeDestroy () {

      clearTimeout(this.resetTimerID);

      clearTimeout(this.redirectTimerID);
    },

    methods: {

      resetInput ({ payload }) {

        const {marker} = payload;

        this.formInputs[marker]['error'] = '';
      },

      async handlePasswordChange ({ payload }) {

          this.isModalOpen = payload;

            await this.reAuthenticateUser();

            if (this.isUserReAuthenticated) {

              await this.initPasswordChange();
          }
      },

      async reAuthenticateUser () {

        try {
          const credential = firebase
          .auth.EmailAuthProvider
          .credential(this.currentUserEmail, this.formInputs.currentPassword.model);

          const authSuccess = await this.currentUser.reauthenticateWithCredential(credential);

          if (authSuccess) {

            this.isUserReAuthenticated = true;
          }

        }  catch (err) {

          this.formInputs.currentPassword.error = 'The password you entered is not your current password.';

          this.isUserReAuthenticated = false;
        }
      },

      async initPasswordChange() {

        try {

          this.internalError = '';

          const functionURL = process.env.VUE_APP_CHANGE_PASSWORD_VALIDATION;

          const method = 'POST';

          const requestData = {

            formInputs: this.formInputs,
            currentUserId: this.currentUserId,

          };

          const validationResponse = await this.makeFirebaseRequest(functionURL, method, requestData);

          if  (validationResponse.status !== 200) {

            const { data } = validationResponse.data.body;

            this.setServerValidationErrors(data);

          } else {

            let passwordChangeResponse;

            if (validationResponse.status === 200) {

              const { newPassword } = validationResponse.data.body.data;

              passwordChangeResponse = await this
              .updatePassword(this.currentUserId,
              this.formInputs.newPassword.model,
              newPassword.hashedPassword);

            }

            this.handleResponses(passwordChangeResponse);
          }

        } catch (err) {

            console.log('Error: ', err);

            console.log('Error Message: ', err.message);
        }

      },

      handleResponses(passwordChangeResponse) {

            const { passwordChangedSuccess, time } = passwordChangeResponse.data.body;


            if (passwordChangeResponse.status === 500) {

              if (!passwordChangedSuccess) {

                  this.internalError = 'Unable to change password. Please try again later';
              }
            }

            if (passwordChangeResponse.status === 400) {

              if (!passwordChangedSuccess && !time.enoughTimePassed) {

                  this.internalError = `You have to wait ${time.remainingTime} until you can change your password again.`;


              }
            }

            if (passwordChangeResponse.status === 200) {

              if (passwordChangedSuccess && time.enoughTimePassed) {

                this.passwordUpdatedMsg = 'Your new password has been successfully saved';

                this.redirectTimerID = setTimeout(
                  async () => {

                  await firebase.auth().signOut();

                  this.$router.push(
                    {name: 'Login',
                    query: {email: this.currentUserEmail}
                    }
                  );
                }, 3000);
              }
            }
      },

      async updatePassword(currentUserId, newPassword, hashedPassword) {

        try {

          const FIREBASE_URL = process.env.VUE_APP_USER_ACTION_CHANGE_PASSWORD;

          const method = 'POST';

          const requestData = {

            currentUserId,
            newPassword,
            hashedPassword,
          };

          return await this.makeFirebaseRequest(FIREBASE_URL, method, requestData);

        } catch (err) {

          console.log('Error: ', err);

          console.log('Error Message: ', err.message);
        }

      },


      async makeFirebaseRequest (url, method, data) {

            let responseData;

          const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

        try {

          responseData = await axios(
            {
              url,
              method,
              headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`

              },
              data,
            }
          );

          return responseData;

        } catch (err) {

          return err.response;

        }
      },

      cancelPasswordChange ({ payload }) {

          this.isModalOpen = payload;
      },

      openModal () {

          const checks = this.checkForErrors();

          if (!checks.errorsPresent && checks.inputsFilled) {

              this.isModalOpen = true;
          }
      },

      checkForErrors () {

        let checks = {

          errorsPresent: false,
          inputsFilled: true,
        }

        for (let field in this.formInputs) {

          for (let property in this.formInputs[field]) {

            if (property === 'error') {

              if (this.formInputs[field][property].length > 0) {

                  checks.errorsPresent = true;
              }
            }

            if (property === 'model') {

              if (this.formInputs[field][property].length === 0) {

                checks.inputsFilled = false;
              }
            }
          }
        }
        return checks;
      },

      resetFormFields () {

        this.formValuesCancelled = true;

        this.internalError = '';

        this.resetPropertyValues('error');

        this.resetPropertyValues('model');



        this.resetTimerID = setTimeout(
          () => {
          this.formValuesCancelled = false;
          },
        0);

      },

      resetPropertyValues (propertyToReset) {

        for (let field in this.formInputs) {

          for (let property in this.formInputs[field]) {

            if (property === propertyToReset) {


              this.formInputs[field][property] = '';
            }
          }
        }
      },

      captureInputs ({ payload }) {

          for (let field in this.formInputs) {

                if (payload.marker === field) {

                      if (payload.model.trim().length === 0) {

                        this.formInputs[field]['error'] = this.makeError(payload);
                      } else {

                        this.formInputs[field]['model'] = payload.model;
                      }
                }
          }
      },

      makeError (input) {

        let error;

        if (input.marker === 'confirmPassword') {

          error = 'Please confirm your new password';
        }

        if (input.marker === 'newPassword') {

          error = 'Please provide your new password';
        }

        if (input.marker === 'currentPassword') {

          error = 'Please provide your current password';
        }

        return error;
      },

      setServerValidationErrors (returnedInputs) {

        for (let field in this.formInputs) {

          for (let property in this.formInputs[field]) {

            if (property === 'error') {

              this.formInputs[field][property] = returnedInputs[field][property];
            }
          }
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


.password-updated-success-msg {
  color: lighten(green,15);
  margin-bottom: 2rem;
  margin-left: 1rem;
}


#internal-error {

  color: darken($red, 5);
  font-weight: 900;
}


.change-password-form-container {
  background-color: #fff;
  padding: 1rem;
  padding-left: 3rem;
  width: 85%;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  position: relative;
}

.change-password-form-title {

  h1 {
    color: $lightBlue;
  }

  p {
    color: lighten($black, 5);
    font-weight: 900;
  }
}

.change-password-btns {

  margin: 2rem 0;

  button {
    cursor: pointer;
    transition: all 0.5s ease-out;
    border: none;
    margin: 0 1rem;
    width: 120px;
    height: 40px;
    border-radius: 7px;

    &:hover {

      opacity: 0.7;
    }

    &:first-of-type {
      background-color: $blue;
      color: $offwhite;
    }

    &:last-of-type {
      background-color: $gray;
      color: $black;
    }
  }
}

@media (max-width: 600px) {

  .change-password-form-container {
        padding: 0.5rem;
        width: 95%;
  }

  .change-password-form-title {

    h1 {
      text-align: center;
      font-size: 1.7rem;
    }
  }



.change-password-btns {

  margin: 2rem 0;
  display: flex;
  justify-content: center;


}

}

</style>