<template>
  <div class="delete-restaurant-container">
    <h2 class="delete-restaurant-title"><i class="fas fa-exclamation-triangle"></i> Danger Zone</h2>
    <p class="delete-error" v-if="deleteError">{{ deleteError }}</p>
    <p class="delete-success-message" v-if="deleteSuccess">{{ deleteSuccess }}</p>
    <p class="transaction-info">Owner: <span>{{ owner }}</span></p>
    <p class="transaction-info">With Grubbee since: <span>{{ transactionDate }}</span></p>
    <DeleteRestaurantButton
      @openModal="handleOpenModal"
    />
    <DeleteRestaurantModal
      v-if="dataIsLoaded"
      :owner="owner"
      :currentUserId="currentUserId"
      :isModalOpen="isModalOpen"
      @closeModal="handleCloseModal"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { firebase } from '@firebase/app';


import DeleteRestaurantButton from './DeleteRestaurantButton.vue';
import DeleteRestaurantModal from './DeleteRestaurantModal.vue';

export default {
  name: 'DeleteRestaurant',

  props: {
    currentUserId: String,
  },

  components: {

    DeleteRestaurantButton,
    DeleteRestaurantModal,
  },

  data () {

    return {
      transactionDate: '',
      isModalOpen: false,
      owner: '',
      dataIsLoaded: false,
      deleteFired: false,
      deleteError: '',
      deleteSuccess: '',
      timerID:'',
    }
  },

  async created () {

    await this.getPurchaseDate();
  },

  mounted() {


  },

  beforeDestroy () {

    clearTimeout(this.timerID);
  },

  methods: {

    async handleDelete({bool, restaurantId}) {

      try {

        this.isModalOpen = bool;

        const FIREBASE_URL = process.env.VUE_APP_DELETE_RESTAURANT;

        const requestData = {

          restaurantId,
          currentUserId: this.currentUserId,
        }

        const { data } = await this.sendRequest(FIREBASE_URL, 'POST', requestData);

        const { status } = data.body;



        if (status === 204) {

          this.deleteSuccess = 'Your restaurant has been successfully removed from Grubbee';

          this.timerID = setTimeout(
            () => {

            this.$router.push('/');
            }, 2500);
        } else {

          this.deleteError = 'Unable to remove your restaurant at this time. Please try again later.'
        }


      } catch (err) {

        console.log(err);
        console.log(err.message);
      }

    },

    handleCloseModal ({ bool }) {

      this.isModalOpen = bool;
    },

    handleOpenModal ({ bool }) {

      this.isModalOpen = bool;
    },

    async getPurchaseDate () {

      try {
        const FIREBASE_URL = process.env.VUE_APP_GET_PURCHASE_DATE;

        const requestData = {

          currentUserId: this.currentUserId,
        };

        const { data } = await this.sendRequest(FIREBASE_URL, 'POST', requestData);

        const { transactionDate, owner } = data.body.data;

        this.transactionDate = transactionDate;

        this.owner = owner;

        if (this.owner) {

          this.dataIsLoaded = true;
        }

      } catch (err) {

        console.log(`Error: ${err}`);
        console.log(`ErrorMessage: ${err.message}`);
      }
    },

    async sendRequest (url, method, data) {

      try {


    const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);


        const result = await axios(
          {
            method,
            url,
            headers: {

              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`

            },
            data,
          }
        );
        return result;

      } catch (err) {

         console.log(`Error: ${err}`);
         console.log(`ErrorMessage: ${err.message}`);
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


.transaction-info {
  font-size: 0.9rem;
  color: darken($gray, 20);

  span {
    color: $lightBlue;
    font-weight: bold;
  }
}

.delete-error {

  font-size: 0.9rem;
  color: $red;
  font-weight: bold;
}

.delete-success-message {
  color: green;
  font-size: 0.9rem;
  font-weight: bold;
}

.delete-restaurant-title {
  background-color: #ffb732;
  padding: 0.4rem;
  color: $gray;
  border-radius: 0.5rem;
}

.delete-restaurant-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 95%;
  position: relative;
}

@media (max-width: 600px) {
  .delete-restaurant-container {
    align-items: center;
  }
}
</style>