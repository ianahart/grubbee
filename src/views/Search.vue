<template>
  <div class="search">
    <div class="search-bar-container">
      <div class="search-bar-overlay">
        <img src="../assets/logo.png" alt="grubbee icon" />
        <SearchBar
          @set="getSearchResults"
          @loader="handleLoader"
        />
      </div>
    </div>
    <div class="search-spinner-container">
           <Spinner v-if="isLoading" />
    </div>
    <div class="min-width-container">
          <transition name="slide-text">
            <div  v-if="restaurants.length && !isLoading" class="results-header">
              <header>
              <h1>Top Matches</h1>
              <div></div>
              <h3>({{ restaurants.length }}) Results</h3>
            </header>
          </div>
          </transition>
      <transition name="fade-map">
    <div v-if="restaurants.length && !isLoading" class="search-results-container">
      <SearchResult
          v-for="restaurant in restaurants" :key="restaurant.id"
          :restaurant="restaurant"
          :currentUserId="currentUserId"
          :currentUser="currentUser"
      />
    </div>
    </transition>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import SearchResult from '../components/SearchResult';

  export default {
    name: 'Search',
    components: {
      SearchBar,
      SearchResult,
      Spinner
    },

    data () {

      return {
      restaurants: [],
      currentUserId: firebase.auth().currentUser.uid,
      isLoading: false,
      currentUser: null,
      db: firebase.firestore(),
      }


    },

    mounted() {

      this.getCurrentUser();
    },

    watch: {
      restaurants: function () {
          if (this.restaurants.length) {

            this.isLoading = false;
          }
      }
    },
    methods: {
      getSearchResults (payload) {

        this.restaurants = payload.results;

        if (!this.restaurants.length) {

          this.isLoading = false;
        }
      },

      handleLoader(payload) {

        this.isLoading = payload.loading;
      },

      getCurrentUser () {

        this.db.collection('users')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

           querySnapshot.forEach((doc) => {

             this.currentUser = doc.data();
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

//****TRANSITIONS****/
.fade-map-enter-active, .fade-map-leave-active {
  transition: all 1s ease-in-out;
}

.fade-map-enter, .fade-map-leave-active
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(200px);
  opacity: 0;
}

.slide-text-enter-active, .slide-text-leave-active {

  transition: all 1s ease-in-out;
}


.slide-text-enter, .slide-text-leave-active {
    transform: translatex(200px);
    opacity: 0;
}
//****END TRANSITIONS****/


.search-spinner-container {
  margin: 0 auto;
  text-align: center;
}

.search-results-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  gap: 20px;
  margin: 3rem;
}

.min-width-container {
  min-height: 800px;
}

.search-bar-container {
  height: 600px;
  background-image: url('../assets/search.jpg');
  background-size: cover;
  background-position: center;
  position: relative;

  img {
    margin-bottom: 1rem;
  }

}

.results-header {
  header {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  h1 {
    margin-bottom: 0;
  }

  div {
    height: 2px;
    background-color: $red;
    width: 200px;
  }

  h3 {
    color: gray;
    font-style: italic;
  }
}

.search-bar-overlay {
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.search-bar-container h1 {

  color: $offwhite;
  margin: 0;
}

@media (max-width: 860px) {
  .search-results-container {
    grid-template-columns: 1fr;
  }
}

</style>