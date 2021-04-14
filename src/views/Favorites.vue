<template>
  <div class="favorites-page">

    <div class="favorites-grid">
      <div class="favorite-image-column">
        <h2 class="m-1">&quot;Good Friends,</h2>
        <h2 class="m-2">Good Food,</h2>
        <h2 class="m-3">Good Times&quot;</h2>
        <div class="favorite-image-wrapper">
            <img src="../assets/favorites-2.jpg" />
        </div>
      </div>
      <div @scroll="handleScroll($event)" class="favorite-favorites-column" ref="favoriteColumn">
          <header>
            <h1><i class="fas fa-heart"></i> Favorites</h1>
         </header>
         <div class="favorites-list-container">
           <div v-for="favorite in favorites" :key="favorite.restaurantId">
             <Favorite
             @delete="handleDeleteFavorite"
             :currentUser="currentUser"
             :favorite="favorite" />
           </div>
           <div v-if="loader && totalNumFavorites > favorites.length" class="spinner-container">
              <Spinner />
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import Favorite from '../components/Favorite';
import Spinner from '../components/Spinner';

  export default {

    name: 'Favorites',
    components: {
      Favorite,
      Spinner
    },

    data() {
      return {
        db: firebase.firestore(),
        currentUserId: firebase.auth().currentUser.uid,
        favorites: [],
        favoriteColumnHeight: 0,
        currentLastFavorite: null,
        scrollAtBottom: false,
        loader: false,
        totalNumFavorites: null,
        currentUser: null,
      }
    },

    created() {

      this.getCurrentUser();
    },

    mounted() {

      this.fetchFavorites();

      this.getTotalNumFavorites();

      this.favoriteColumnHeight = this.$refs.favoriteColumn.clientHeight;

    },

        watch: {

        scrollAtBottom: function () {

            if (this.scrollAtBottom) {

              this.loadAdditionalFavorites();
            }
        }
      },

    methods: {

      getCurrentUser() {
        this.db.collection('users')
        .where('userId', '==', firebase.auth().currentUser.uid)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach((doc) => {

            this.currentUser = doc.data();
          })
        })
      },

      handleScroll (event) {

        let scrollY =  event.srcElement.scrollTop;

        if (scrollY >= this.favoriteColumnHeight) {

            this.scrollAtBottom = true;

        }
      },

      handleDeleteFavorite(payload) {

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            if(payload.id === doc.data().restaurantId) {

              this.db.collection('favorites')
              .doc(doc.id)
              .delete()
              .then(
                () => {

                  this.favorites = this.favorites.filter((favorite) => {

                    return favorite.restaurantId !== doc.data().restaurantId;
                  });
              });
            }
          });
        });
      },

      getTotalNumFavorites () {

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

            this.totalNumFavorites = querySnapshot.docs.length;
        });
      },

      fetchFavorites() {

        this.db.collection('favorites')
         .where('userId', '==', this.currentUserId)
         .orderBy('name', 'asc')
         .limit(5)
         .get()
         .then(
           (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            this.favorites.push(doc.data());
          });
        });
      },

      loadAdditionalFavorites() {

        this.loader = true;

        this.currentLastFavorite = this.favorites.find(

          (favorite, index) => {

            if (index === this.favorites.length - 1) {

              return favorite;
            }

        });

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .orderBy('name', 'asc')
        .startAfter(this.currentLastFavorite.name)
        .limit(5)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach((doc) => {

            setTimeout(() => {

              this.loader = false;
              this.scrollAtBottom = false;
              this.favorites.push(doc.data());
            }, 1750)

          });
        });
      }
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

.favorites-page {
  height: 100%;
  header {
    h1 {
      border: 1px solid $gray;
      margin: 0;
      padding: 0.3rem;
      color: $blue;
      text-align: center;
    }
  }
}

.favorites-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

}

.favorite-image-column {
  background-image: url('../assets/favorites.png');
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;

  h2 {
    text-align: center;
    color: $offwhite;
  }

  .m-2 {
    margin-left: 3rem;
  }

  .m-3 {
    margin-left: 10rem;
  }
}

.favorite-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;

  img {
    width: 30%;
    border-radius: 11px;
    // max-width:
  }
}

.favorite-favorites-column {
  height: 751px;
  overflow-y: scroll;
  overflow-x: hidden;

  header {
    i {
      color: $red;
    }
  }
}

.spinner-container {
  text-align: center;
}

@media (max-width: 867px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorite-image-wrapper {
    height: 45%;
  }
}



</style>