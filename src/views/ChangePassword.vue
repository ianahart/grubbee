<template>
  <div>
    <div v-if="isBaseDataLoaded" class="change-password-container">
      <ChangePasswordHeader />
      <ChangePasswordForm
        :currentUserId="currentUserId"
        :currentUser="currentUser"
        :currentUserEmail="currentUserEmail"
      />
    </div>
    <p class="load-error-page" v-else>{{ loadError }}</p>
  </div>
</template>




<script>
import axios from 'axios'
import { firebase } from '@firebase/app';

import ChangePasswordHeader from '../components/ChangePasswordHeader.vue';
import ChangePasswordForm from '../components/ChangePasswordForm.vue';


export default {

  name: 'ChangePassword',

  props: {

  },

  components: {

    ChangePasswordHeader,
    ChangePasswordForm,
  },

  data () {

    return {
      currentUserId: firebase.auth().currentUser.uid,
      currentUser: firebase.auth().currentUser,
      currentUserEmail: '',
      isBaseDataLoaded: '',
      loadError: '',

    }
  },

  async created () {

    await this.setUserEmail();
  },

  mounted () {

  },

  methods: {

    async setUserEmail () {

      try {

          const FIREBASE_URL= process.env.VUE_APP_RESPOND_USER_EMAIL;

          const method = 'POST';

          const requestData = {

            currentUserId: this.currentUserId,
          };


        const response = await this.sendFirebaseRequest(FIREBASE_URL, method, requestData);

        if (response.status === 500) {

            const { error } = response.data.body;

            this.loadError = error;

            this.isBaseDataLoaded = false;
        }

        if (response.status === 200) {

          const { data } = response.data.body;

          this.currentUserEmail = data;

          this.isBaseDataLoaded = true;
        }


      } catch (err) {

        console.log(err.message);

        console.log(err);
      }
    },

    async sendFirebaseRequest (url, method, data) {

      let response;

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

      try {

        response = await axios(
          {
            url,
            headers: {

              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`

            },
            method,
            data,
          }
        );

        return response;

      } catch (err) {

        return err.response;
      }
    }
  },
}





</script>


<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.change-password-container {
  background-color: $gray;
  height: 100%;
  width: 100%;
}

.load-error-page {

  color: $red !important;
  text-align: center;
}

</style>