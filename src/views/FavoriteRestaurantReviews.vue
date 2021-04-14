<template>
  <div class="restaurant-reviews">
    <header>
      <img src="../assets/review-icon.png" alt="review-icon" />
      <h1>Reviews For {{ restaurantName }}</h1>
    </header>
    <div class="filter-options-container">
      <div
        @click="handleSort(button.action)"
        v-for="button in buttons" :key="button.id"
      >
      <button
       :class="activeButton === button.action ? 'active-sort-button' : ''"
        >{{ button.text }}
      </button>
      <transition name="fade-underline">
        <div
        v-if="activeButton === button.action"
        :class="activeButton === button.action ? 'active-sort-button-underline' : ''">
        </div>
      </transition>
      </div>
    </div>
    <div class="filter-divider"></div>
    <div class="restaurant-reviews-container">
      <RestaurantReview
        @deleteComment="handleDeleteComment"
        v-for="review in getNextBatch"
        v-bind:key="review.id"
        :review="review"
      />
      <div
        v-if="allLoaded === false"
        class="read-more-btn-container"
      >
        <button v-if="!isLoading" @click="paginateReviews" class="read-more-btn">
          Read More... <i class="fas fa-chevron-down"></i>
        </button>
        <Spinner v-if="isLoading" />
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import RestaurantReview from '../components/RestaurantReview';
import Spinner from '../components/Spinner';

export default {
  name: 'FavoriteRestaurantReviews',

  components: {
    RestaurantReview,
    Spinner,
  },

  data() {
    return {
      db: firebase.firestore(),
      restaurantId: null,
      batchReviews: [],
      restaurantName: null,
      buttons: [
        {id: 0, action: 'by name', text: 'Name Z-A'},
        {id: 1, action: 'by rating', text: 'Highest Rated'},
        {id: 2, action: 'by date', text: 'Most Recent'},
      ],
      activeButton: '',
      fullName: '',
      currentUserId: firebase.auth().currentUser.uid,
      lastDocument: 4,
      reviewsPerClick: 4,
      allReviews: [],
      isLoading: false,
      userNames: [],
      totalNumReviews: null,
      allLoaded:false,
      sortSelected: false,
      commentDeleted: false,
      favoriteCommentExists: false,
    };
  },

  mounted() {

    this.getRestaurantName();


  },


  created() {

     this.restaurantId = this.$route.params.id;

     this.getInitialReviews();
  },

  computed: {
    getNextBatch() {


        if (this.allReviews.length === this.totalNumReviews && !this.commentDeleted) {

        this.allReviews.forEach(

        (review, index) => {

        if (this.lastDocument > index) {

              this.batchReviews.push(review);

        }
      });
      } else if (this.commentDeleted) {
          return this.allReviews.slice(0, this.lastDocument);


        }

      return this.batchReviews;
    },

  },

  watch: {
     batchReviews: function () {

       if (this.batchReviews.length === this.totalNumReviews || this.lastDocument >= this.totalNumReviews && this.commentDeleted) {

         this.allLoaded = true;
       }

     }
  },



  methods: {


    handleSort(sortBy) {

      this.sortSelected = true;

      this.activeButton = sortBy;

      if (sortBy === 'by rating') {

          this.performSort('rating');

          this.batchReviews = [];
      }

      if (sortBy === 'by date') {

        this.performSort('createdAt');

        this.batchReviews = [];
      }

      if (sortBy === 'by name') {

        this.performSort('userName');

        this.batchReviews = [];
      }

    },

    performSort(field) {


       this.allReviews = this.allReviews.sort(
         (a, b) => {

          if (a[field] > b[field]) {

            return -1;

          } else if (a[field] < b[field]) {

            return 1;

          } else {

            return 0;
          }
        });

    },

    paginateReviews() {

      this.isLoading = true;

      setTimeout(() => {

      if (this.lastDocument === this.batchReviews - 1) {

        this.lastDocument = this.lastDocument + 1;

      } else {

        this.lastDocument = this.lastDocument + this.reviewsPerClick;
      }
      this.batchReviews = [];

        this.isLoading = false;
      }, 1500);
    },

    filterReviews(reviews, payload) {

        return reviews.filter(
          (review) => {

              return review.id !== payload.id ? review : '';

      });
    },

    handleDeleteComment(payload) {

      const filteredBatchedReviews = this.filterReviews(this.batchReviews, payload);

      const filteredAllReviews = this.filterReviews(this.allReviews, payload);

      this.allReviews = filteredAllReviews;

      this.batchReviews = filteredBatchedReviews;

      this.commentDeleted = true;

       this.removeCommentFromFavorites(payload);

      this.db
        .collection('reviews')
        .where('id', '==', payload.id)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            this.db
              .collection('reviews')
              .doc(doc.id)
              .delete()
              .then(
                () => {

                this.updateUserReviewsList(
                  doc.data().restaurantId,
                  doc.data().id
                );
              });
          });
        });
    },

    removeCommentFromFavorites(payload) {

      this.db.collection('favorites')
      .where('restaurantId', '==', payload.restaurantId)
      .get()
      .then(
        (querySnapshot) => {

        if (querySnapshot.docs.length > 0) {

          this.favoriteCommentExists = true;
        }


        querySnapshot.forEach(
          (doc) => {

        if (this.favoriteCommentExists) {

           const reviews = doc.data().reviews;

           const commentToDelete = this.getCommentToDelete(reviews, payload.id);

           const docRef = this.db.collection('favorites').doc(doc.id);

           docRef.update({
             reviews: firebase.firestore.FieldValue.arrayRemove(commentToDelete)
           })
        }
        });
      });
    },

    getCommentToDelete(reviews, id) {

      return reviews.find((review) => {

        return review.id === id ? review : '';
      });
    },

    updateUserReviewsList(restaurantId, reviewIdToRemove) {
      this.db
        .collection('users')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {
            const userReviewsRef = this.db.collection('users').doc(doc.id);

            userReviewsRef
              .update({
                reviews: firebase.firestore.FieldValue.arrayRemove(
                  restaurantId
                ),
              })
              .then(
                () => {
                this.allReviews = this.allReviews.filter((review) => {

                  return review.id !== reviewIdToRemove;
                });
              });
          });
        });
    },

    getRestaurantName() {
      this.db
        .collection('restaurants')
        .where('id', '==', this.restaurantId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            this.restaurantName = doc.data().name;
          });
        });
    },

     getInitialReviews() {
      this.db
        .collection('reviews')
        .where('restaurantId', '==', this.restaurantId)
        .get()
        .then(
          (querySnapshot) => {
            this.totalNumReviews = querySnapshot.docs.length;
          querySnapshot.forEach(
            (reviewDoc) => {

                this.addAuthorOfReview(reviewDoc);
          });
        })
    },

    addAuthorOfReview(review) {
        this.db.collection('users').where('userId', '==', review.data().userId)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            this.userNames.push(doc.data());

          });
            this.getAuthor(review);
        })
    },

      getAuthor(reviewDoc) {

        this.allReviews.push(reviewDoc.data());

            this.allReviews.forEach((review) => {

            this.userNames.forEach((user) => {

                if (review.userId === user.userId) {

                    review.userName = user.firstName + ' ' + user.lastName;


                 } else {

                    if (!Object.keys(review).includes('userName')) {

                       review.userName = '(Deleted User)'
                    }
                 }
             })
       });
  }
  },

};
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

//****TRANSITIONS****/
.fade-underline-enter-active, .fade-underline-leave-active {
  transition: all 0.5s;
  width: 50%;

}


.fade-underline-enter, .fade-underline-leave-to {
  opacity: 0;
  width: 0%;
  transform:translateX(-200px);
}
//****TRANSITIONS****/

.active-sort-button-underline {
  height: 3px;
  background-color: $blue;
  margin: 0 1rem;
}

.filter-options-container {
  display: flex;
  justify-content: center;
  margin-top: 5rem;
}

.active-sort-button {
  font-weight: bold;
  color: $black;
}



.filter-divider {
  height: 2px;
  background: $gray;
  margin: 0 auto;
  margin-top: 0.5rem;
  width: 70%;
}

.read-more-btn-container {
  text-align: center;
  margin: 0 auto;
  margin-bottom: 2rem;
  width: 150px;

  button {
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    border-radius: 11px;
    background-color: $red;
    border: none;
    margin-bottom: 2rem;
    width: 100%;
    padding-top: 0.2rem;
    color: $offwhite;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:hover {
      background-color: darken($red, 10);
    }
  }
}

.filter-options-container {
  button {
    background-color: transparent;
    border: none;
    margin: 0 1rem;
    outline: none;
    font-size: 1rem;
    cursor: pointer;
  }

}

.restaurant-reviews {
  header {
    display: flex;
    justify-content: center;
    border: 1px solid $gray;
    padding: 0.3rem 0;
    h1 {
      color: $blue;
      margin: 0;
      margin-left: 0.5rem;
    }
  }
}

.restaurant-reviews-container {
  width: 50%;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .restaurant-reviews-container {
    width: 90%;
  }
}
</style>
