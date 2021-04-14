<template>
  <div
    @mouseover="showToolTip"
    @mouseleave="hideToolTip"
    class="favorite-btn-container">
    <span
     @click="handleClick"
     >
      <i v-if="!favorite" class="far fa-heart favorite-btn"></i>
      <i v-if="favorite && !toolTipShowing" class="fas fa-heart favorited"></i>
      <i v-if="favorite && toolTipShowing" class="fas fa-heart-broken"></i>
    </span>
    <span v-if="added" class="favorite-tooltip">Added!</span>
    <span v-if="toolTipShowing && !favorite" class="favorite-tooltip">Favorite</span>
    <span v-if="toolTipShowing && favorite" class="favorite-tooltip">Unfavorite</span>

  </div>

</template>


<script>
import { firebase } from '@firebase/app';

  export default {
    name: 'FavoriteBtn',
    props: {
      restaurant: Object,
      restaurants: Array,
    },
    data () {
      return {
        toolTipShowing: false,
        favorite:       false,
        db:             firebase.firestore(),
        currentUserId:  firebase.auth().currentUser.uid,
        favorites:      [],
        added:          false,
      }
    },

    mounted() {

      this.syncFavorites();

    },

    methods: {
      showToolTip() {

        this.toolTipShowing = true;
      },

      hideToolTip() {

        this.toolTipShowing = false;
      },

      handleClick() {

        if (this.favorite) {

          this.favorite = false;

          this.removeFromFavorites();

        } else {

          this.favorite = true;

          this.addToFavorites();
        }
      },

      addToFavorites() {

          let restaurant = {};


        if (this.restaurant.restaurantOwnerId !== undefined) {

            restaurant.address = this.restaurant.address;
            restaurant.avg_rating = this.restaurant.avg_rating;
            restaurant.city = this.restaurant.city;
            restaurant.image_url = this.restaurant.image_url;
            restaurant.name = this.restaurant.name;
            restaurant.phone = this.restaurant.phone;
            restaurant.restaurantId = this.restaurant.id;
            restaurant.reviews = this.restaurant.reviews;
            restaurant.state = this.restaurant.state;
            restaurant.userId = this.currentUserId;
            restaurant.zip = this.restaurant.zip_code;
            restaurant.restaurantOwnerId = this.restaurant.restaurantOwnerId

        } else {

            restaurant.address = this.restaurant.address;
            restaurant.avg_rating = this.restaurant.avg_rating;
            restaurant.city = this.restaurant.city;
            restaurant.image_url = this.restaurant.image_url;
            restaurant.name = this.restaurant.name;
            restaurant.phone = this.restaurant.phone;
            restaurant.restaurantId = this.restaurant.id;
            restaurant.reviews = this.restaurant.reviews;
            restaurant.state = this.restaurant.state;
            restaurant.userId = this.currentUserId;
            restaurant.zip = this.restaurant.zip_code;

        }



        this.db.collection('favorites').add(restaurant)
        .then(
          () => {

          this.added = true;

          setTimeout(() => {

            this.added = false;
          }, 3000);
        });
      },

      syncFavorites() {

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {
            this.favorites.push(doc.data().restaurantId);

            if (this.favorites.includes(this.restaurant.id)) {

                this.favorite = true;
            }
          });
        })
      },

      removeFromFavorites() {

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

              if (doc.data().restaurantId === this.restaurant.id) {

                const docRef = this.db.collection('favorites').doc(doc.id);

                docRef.delete();
              }
          });
        });
      },
    }
  }
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

  .favorite-btn-container {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    i {
      cursor: pointer;
      color: $red;
      font-size: 1.2rem;
    }
  }


  .favorite-tooltip {
    background-color: $gray;
    margin-left: 0.5rem;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
</style>