<template>
  <div class="delete-account-outer-container">
    <DeleteAccountModal
      v-if="isModalOpen"
      @triggermodalaction="handleModalAction"
    />
    <div class="delete-account-inner-container">
      <DeleteAccountHeader />
      <DeleteAccountDropdown
        @triggerchange="changeSelected"
        @triggercustom="changeCustomSelected"
        :options="options"
      />
      <DeleteAccountConfirmPassword
        @passwordconfirmed="handlePasswordConfirmed"
        :currentUser="currentUser"
      />
      <transition name="slide-button" appear>
        <div v-if="passwordConfirmed" class="delete-account-button-container">
          <p v-if="requestError.length">{{ requestError }}</p>
          <button @click="openModal">Permanently delete my account</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import axios from 'axios';

import DeleteAccountHeader from '../components/DeleteAccountHeader';
import DeleteAccountModal from '../components/DeleteAccountModal';
import DeleteAccountDropdown from '../components/DeleteAccountDropdown';
import DeleteAccountConfirmPassword from '../components/DeleteAccountConfirmPassword';

export default {
  name: 'DeleteAccount',

  props: {},

  components: {
    DeleteAccountHeader,
    DeleteAccountModal,
    DeleteAccountDropdown,
    DeleteAccountConfirmPassword,
  },

  data() {
    return {
      currentUser: firebase.auth().currentUser,
      passwordConfirmed: false,
      isModalOpen: false,
      requestError: '',
      reason: '',
      options:[
        {text: 'Let us know', value: ''},
        {text: 'Trouble getting started', value: 'trouble'},
        {text: 'Created a second account', value: 'secondAccount'},
        {text: 'Privacy concerns', value: 'privacy'},
        {text: 'Want to remove something', value: 'removeSomething'},
        {text: 'Too busy/too distracting', value: 'notEnoughTime'},
        {text: 'Something else', value: 'custom'},
      ],
    };
  },

  created() {

  },

  mounted() {

  },

  computed: {

  },

  watch: {

  },

  methods: {

    async handleModalAction(payload) {

      this.isModalOpen = false;

      if (payload.toLowerCase() === 'remove') {

          await this.deleteUserAccount();
      }
    },

    openModal () {

      this.isModalOpen = true;
    },

    handlePasswordConfirmed (payload) {

      this.passwordConfirmed = payload;
    },

    changeCustomSelected (payload) {

      this.reason = payload;
    },

    changeSelected (payload) {

      this.reason = payload;
    },

    async sendFireBaseRequest(data, method, url) {

     let response;

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

      try {
        response = await axios(
          {
          headers: {

            'Content-Type': 'application/json',
             Accept: 'application/json',
             Authorization: `Bearer ${idToken}`,
          },
          method,
          url,
          data,
         }
        );

        return response;
      } catch (e) {

        this.requestError = 'Unable to delete account. Please try again later.';
      }
    },

    async deleteUserAccount () {

      try {

        this.requestError = '';

        const FIREBASE_URL = process.env.VUE_APP_DELETE_ALL_USER_DATA;

        const requestData = {

          currentUserId: this.currentUser.uid,
          reason: this.reason,
          createdAt: Math.round(new Date().getTime() / 1000),
          email: this.currentUser.email,
        }

        const method = 'POST';

        const response = await this.sendFireBaseRequest(requestData, method, FIREBASE_URL);

        const { accountDeleted } = response.data.body;

        if (accountDeleted && response.status === 200) {

          await firebase
          .auth()
          .signOut();

          this.$router.push({ name:'Login' });
        } else {

          this.requestError = 'Unable to delete account. Please try again later.';
        }

      } catch (e) {

        console.log(e);
      }
    }
  },
};
</script>

<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;


// TRANSITIONS
.slide-button-enter-active, .slide-button-leave-active {
  transition: all 0.5s ease-in;


}

.slide-button-enter, .slide-button-leave-to {
  opacity: 0;
  transform: translateX(-200px);
}
// END TRANSITIONS


.delete-account-outer-container {
  position: relative;
  background-color: lighten(#f0f0f0, 2);
  height: 100%;
  width: 100%;
  display: flex;
}

.delete-account-inner-container {
  width: 90%;
  margin: 0 auto;
  padding-top: 3rem;
  margin-top: 2rem;
}

.delete-account-button-container {
  margin: 3rem auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  p {

    color: $red;
    font-weight: bold;
    font-size: 0.85rem;
  }

  button {
    height: 35px;
    background-color: $red;
    color: $offwhite;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: darken($red, 5);
    }
  }
}

</style>
