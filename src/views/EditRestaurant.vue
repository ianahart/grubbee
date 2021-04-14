<template>
  <div class="edit-restaurant-container">

  <EditRestaurantHeader />
    <div v-if="preDataLoaded" class="edit-restaurant">

      <StripeRefund
        :currentUserId="currentUserId"
        :firstName="userFirstName"
      />
    </div>
    <DeleteRestaurant
      :currentUserId="currentUserId"
    />
    <EditRestaurantForm
      :currentUserId="currentUserId"
    />
   <EditRestaurantTestimonial
    :currentUserId="currentUserId"
   />
  </div>
</template>

<script>

import { firebase } from '@firebase/app';
import axios from 'axios';

import EditRestaurantHeader from '../components/EditRestaurantHeader';
import EditRestaurantForm from '../components/EditRestaurantForm';
import StripeRefund from '../components/StripeRefund.vue';
import DeleteRestaurant from '../components/DeleteRestaurant.vue';
import EditRestaurantTestimonial from '../components/EditRestaurantTestimonial.vue';

export default {

  name: 'EditRestaurant',

  components: {

    StripeRefund,
    EditRestaurantHeader,
    EditRestaurantForm,
    DeleteRestaurant,
    EditRestaurantTestimonial,
  },

  data () {

    return {

      currentUserId: firebase.auth().currentUser.uid,
      preDataLoaded: false,
      userFirstName: '',
      testimonalSubmitted: false,

    }
  },

  async created () {

    await this.determineIfRedirect();
  },

  mounted () {



  },

  methods: {

     async determineIfRedirect() {

        let result;

      const idToken = await firebase
        .auth()
        .currentUser
        .getIdToken(true);

        try {

         result = await axios(
            {
              method: 'POST',
              url: process.env.VUE_APP_REDIRECT_NO_RESTAURANT,
              headers: {
              "content-type": "application/json",
              "Accept": "application/json",
              Authorization: `Bearer ${idToken}`

              },

              data: {
                currentUserId: this.currentUserId,
              }
            }
          );

        const response = result.data.body;

        if (Object.keys(response).length) {

          this.preDataLoaded = true;
        }

        if (response.userIsAuthorized) {

            this.userFirstName = response.data.firstName;

            return;

        } else {

          this.$router.back();
        }


        } catch (err) {

          if (err.message) {

              this.preDataLoaded = true;

          }
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

</style>
