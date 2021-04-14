<template>
  <transition name="fade-delete-modal">
    <div v-if="isModalOpen && initialDataLoaded" class="delete-restaurant-modal">
      <p class="delete-restaurant-modal-title">
        Are you absolutely sure?
        <span>
          <img @click="sendCloseModal(false)" src="../assets/x.svg" alt="close x"/>
        </span>
      </p>
      <div class="delete-restaurant-modal-container">
      <div class="delete-restaurant-modal-inner">
        <p>This action <strong>cannot</strong> be undone. This will permanently delete <strong>{{ restaurantName }} from Grubbee.</strong></p>
        <p>Please type <b>{{ typeChallenge }}</b> to confirm:</p>
        <input @keyup="watchTypeChallenge" type="text" v-model="deleteConfirmationInput" />
      </div>
        <div class="delete-restaurant-modal-controls">
          <button :class="buttonStyle" :disabled="!testPassed" @click="sendDelete(restaurantId, false)">Delete</button>
          <button @click="sendCloseModal(false)">Cancel</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import axios from 'axios';
import { firebase } from '@firebase/app';

  export default {

    name: 'DeleteRestaurantModal',

    components: {

    },

    props: {
      currentUserId: String,
      isModalOpen: Boolean,
      owner: String,
    },

    data () {

      return {
        restaurantName: '',
        restaurantId: '',
        deleteConfirmationInput: '',
        typeChallenge: '',
        initialDataLoaded: false,
        testPassed: false,
      }
    },

    async created () {

      await this.getRestaurantName();
    },

    mounted () {


    },

    computed: {
      buttonStyle: function () {

        return {
          'default-delete': this.testPassed === false,
          'active-delete': this.testPassed === true,
        }
      },

    },

    methods: {

      sendDelete (restaurantId, bool) {

        this.$emit('delete',
          {
            bool,
            restaurantId,
          }
        );
      },

      watchTypeChallenge() {
        if (this.deleteConfirmationInput.toLowerCase() === this.typeChallenge.toLowerCase()) {

          this.testPassed = true;
        } else {

          this.testPassed = false;
        }
      },

      sendCloseModal (bool) {

        this.testPassed = false;

        this.deleteConfirmationInput = '';

        this.$emit('closeModal', {
          bool,
        })
      },

      async getRestaurantName () {

        try {

          const request = {
            url: process.env.VUE_APP_GET_RESTAURANT_NAME,
            method: 'POST',
            dataBody: {
              currentUserId: this.currentUserId,
            },
          };

          const response = await this.sendFireBaseRequest(request);

          if (response.data.body.message === 'success') {

           const { restaurantName, restaurantId } = response.data.body.data;

            this.restaurantName = restaurantName;

            this.restaurantId = restaurantId;

            this.constructChallenge(this.owner, this.restaurantName);

            this.initialDataLoaded = true;
          }

        } catch (err) {
          console.log(err);
          console.log(err.message);
        }
      },

      constructChallenge (owner, restaurantName) {

         const formattedOwner = owner
         .toLowerCase()
         .split(' ')
         .join('-');

         const formattedRestaurantName = restaurantName
         .toLowerCase()
         .split(' ')
         .join('-');

         this.typeChallenge = `${formattedOwner}/${formattedRestaurantName}`;
      },

      async sendFireBaseRequest(request) {


      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);


        let response;

        try {

          response = await axios(
            {
              method: request.method,
              url: request.url,
              headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${idToken}`

              },

              data: request.dataBody,
            }
          );

          return response;
        } catch (err) {
          console.log(err);
          console.log(err.message);
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
.fade-delete-modal-enter-active, .fade-delete-modal-leave-active {
  transition: opacity .75s;
}
.fade-delete-modal-enter, .fade-delete-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
//****END TRANSITIONS****/

.delete-restaurant-modal {
  background-color: rgba(0,0,0,0.5);
  border-radius: 7px;
  height: 400px;
  max-width: 500px;
  width: 50%;
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0);
}

.delete-restaurant-modal-title {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  font-weight: 900;
  background-color: rgba(0,0,0,0.7);
  color: $gray;
  margin: 0;
  margin-bottom: 2rem;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;

  img {
    cursor: pointer;
  }
}

.delete-restaurant-modal-container {

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 50%;
  padding: 1rem;
}

.delete-restaurant-modal-controls {
  display: flex;
  justify-content: space-evenly;
  width: 80%;

  button {
    transition: all 0.5s ease-in-out;
    border-radius: 7px;
    width: 150px;
    height: 40px;

    &:last-of-type {
      background-color: lighten($blue, 3);
      color: $gray;
      border: none;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.default-delete {
  background-color: $gray;
  color: $red;
  opacity: 0.7;
  border: 2px solid $red;
  cursor: none;
}

.active-delete {
  background-color: $red;
  border: none;
  cursor: pointer;
  color: $gray;
}

.delete-restaurant-modal-inner {
  width: 95%;
  padding: 1rem;
  background-color: rgba(0,0,0,0.5);
  color: $gray;
  border-radius: 7px;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;

  input {
  margin-bottom: 0.3rem;
  width: 50%;
  height: 25px;
  border-radius: 7px;
  border: none;
  }

  b {
    color: $red;
  }

}

@media (max-width: 600px) {
  .delete-restaurant-modal {
    width: 95%;
  }

  .delete-restaurant-modal-controls {


    button {
      margin: 0.5rem;
    }
  }
  .delete-restaurant-modal-inner {
    padding: 0 1rem;
    text-align: center;
  }
  .delete-restaurant-modal-title {
    margin-bottom: 2.5rem;
  }
}

</style>