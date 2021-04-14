<template>
  <div class="search-bar">
    <transition name="fade-errors">
      <div  v-if="searchErrors.length" class="search-error-container">
        <p class="search-error" v-for="(inputError, index) in searchErrors" :key="index">* {{ inputError }}</p>
      </div>
    </transition>
    <form @submit.prevent="handleSubmit">
      <input @keyup="handleInputChange" placeholder="Restaurant..." name="restaurant" v-model="restaurantSearch" />
      <input @keyup="handleInputChange" placeholder="State..." name="state" v-model="stateSearch" />
          <button :class="`${this.inputChange === true && !this.searchErrors.length ? 'slide-search-btn' : ''}`"><i class="fas fa-search"></i> Search</button>
    </form>
    <div>
    </div>
  </div>
</template>

<script>

import { firebase } from '@firebase/app';


  export default {
    name: 'SearchBar',
    components: {
    },
    data () {
      return {
        restaurantSearch: '',
        stateSearch: '',
        inputChange: false,
        searchErrors: [],
        isStateError: false,
        db: firebase.firestore(),
        searchResults: [],
        loading: false,
      }
    },
    methods: {

      handleInputChange() {

        if (this.restaurantSearch.length >= 1
          || this.stateSearch.length >= 1) {

          this.inputChange = true;
        } else {

          this.inputChange = false;
        }

        if (this.stateSearch.length > 2) {

           if (!this.isStateError) {

            this.searchErrors.push("Please use the State's abbreviation (two letters)");

             this.isStateError = true;
           }

          } else {

          this.isStateError = false;

          this.searchErrors = [];
        }
      },

      handleSubmit() {

        if (this.stateSearch.length && !this.restaurantSearch.length) {

          this.searchErrors.push('Please provide a restaurant name');
        }

        if (!this.searchErrors.length) {

               this.loading = true;

              this.setLoader(this.loading);

              this.runSearch();
        }
      },

      resetForm() {

        this.stateSearch = '';

        this.restaurantSearch = '';

        this.inputChange = false;
      },

      runSearch() {

        this.searchResults = [];

          this.db.collection('restaurants')
      .orderBy('search')
      .startAt(this.restaurantSearch.toLowerCase())
      .endAt(this.restaurantSearch.toLowerCase() + '\uf8ff')
      .limit(4)
      .get()
      .then(
        (querySnapshot) => {

          if (querySnapshot.docs.length === 0) {

            const message = `No Results for ${this.restaurantSearch}.`;

            this.searchErrors.push(message);

          }

        querySnapshot.forEach(
          (doc) => {

            this.searchResults.push(doc.data());
        });
    }).then(
      () => {

        if (this.searchResults.length > 1) {

            this.sortResultsByRating();
        }

        if (this.stateSearch.length !== 0) {

          this.searchResults = this.searchResults.filter(

            (result) => {

              return this.stateSearch.toUpperCase() === result.state;
          });
        } else {

          return;
        }
    })
    .then(() => {

      setTimeout(() => {

          this.setResults(this.searchResults);

          this.resetForm();
      }, 1500)

    })
   },

   setResults (results) {

     this.$emit('set', {

       results,

     });
   },

   setLoader(loading) {


     this.$emit('loader', {

       loading,
     });
   },

   sortResultsByRating() {

     this.searchResults.sort(
       (a, b) => {

       if (a.avg_rating > b.avg_rating) {

          return -1;
       } else if (a.avg_rating < b.avg_rating) {

         return 1;
       } else {

         return 0;
       }
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


//****TRANSITIONS****/
.fade-errors-enter-active, .fade-errors-active {
  transition: opacity 0.6s;
}

.fade-errors-enter, .fade-errors-leave-to {
  opacity: 0;
}

//****END TRANSITIONS****/



.search-bar {

  form {
    width: 700px;
    display: flex;
    align-items: center;
    position: relative;
  }

  input {
    width: 42.5%;
    height:30px;
    border-radius: 0.5rem;
    border: none;
    margin: 0.2rem;

    &::placeholder {
      font-style: italic;
    }
  }


  button {
    box-sizing: border-box;
    width: 15%;
    border-radius: 0.5rem;
    margin-left: 0.2rem;
    height: 32px;
    border: none;
    background-color: $red;
    color: $offwhite;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    right: -5%;
    position: absolute;

    &:hover {
      background-color: darken($red, 14);
    }
  }
}

.slide-search-btn {
       z-index: 1;
       transform: translateX(-115%);
       transition: right 0.5s linear;
}

.search-error-container {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  flex-direction: column
  align-items center;
}

.search-error {
  color: $red;
  margin-bottom: 0.1rem;
  text-align: center;
}

  @media (max-width: 700px) {
    .search-bar {
      form {
        flex-direction: column;
        width: 325px;
      }

      input {
        margin: 1rem 0;
        width: 100%;
      }

      button {
        width: 35%;
        position: relative;
        top: 0;
        left:0;
      }
    }

    .slide-search-btn {
      z-index: 1;
      transform: translateX(0);
      transition: right 0.5s linear;
}

  }



</style>