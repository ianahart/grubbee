<template>

  <div v-if="pageLoaded" class="restaurants">
    <div class="restaurants-heading">
      <header>
        <h1>Restaurants</h1>

      </header>
    </div>
    <div v-if="currentUserId && !currentUser.isAdmin" class="favorite-preview">
      <FavoritePreview
        :currentUserId="currentUserId"
      />
    </div>
    <div class="restaurants-container">
      <p v-if="commentDeletion" class="comment-delete-message"><i class="far fa-check-circle"></i> Your comment was successfully removed</p>
      <div v-for="restaurant in restaurants" :key="restaurant.id" class="restaurant">
        <Restaurant
          :restaurant="restaurant"
          :currentUserId="currentUserId"
          :restaurants="restaurants"
          :currentUser="currentUser"
        />
        <div class="add-review-link">
          <router-link v-if="authorized && !currentUser.isAdmin" :to="{path: '/addreview/' + restaurant.id}"><i class="fas fa-pen"></i> Write a Review</router-link>
        </div>
        <div v-if="!currentUserId" class="review-box-unauthorized">
          <router-link :to="{name: 'Register'}"><i class="far fa-newspaper"></i> Sign up to read reviews</router-link>
        </div>
        <div v-if="currentUserId" class="review-box-container">
          <ReviewBox  :currentReviewBox="currentReviewBox"
                      @toggle="toggleReviewBoxes"
                     :reviews="restaurant.reviews"
                     :reviewBoxId="restaurant.id"
                     @remove="removeComment"/>
        </div>
      </div>
    </div>
    <div v-if="authorized" class="paginate-btn">
      <button v-if="loader" @click="loadMoreRestaurants"><i class="fas fa-spinner"></i> Load more...</button>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import ReviewBox from '../components/ReviewBox';
import FavoritePreview from '../components/FavoritePreview';
import Restaurant from '../components/Restaurant.vue';


export default {
  name: 'Restaurants',
  components: {
    ReviewBox,
    Restaurant,
    FavoritePreview
  },
  data() {

    return {
      db: firebase.firestore(),
      restaurants: [],
      lastDocument: null,
      totalDocuments: null,
      loader: true,
      authorized: false,
      reviews: [],
      rating: '',
      currentUserId: null,
      commentDeletion: false,
      currentReviewBox: '',
      favoriteCommentExists: false,
      currentUser: null,
      restaurantLimit: 0,
      pageLoaded: false,
    };
  },

  created() {

     if (firebase.auth().currentUser !== null) {


       this.getCurrentUser();
     }

  },

  mounted() {

    this.pageLoaded = true;

    if (this.pageLoaded) {

      if (firebase.auth().currentUser) {

        this.authorized = true;
      }
    }


    if (this.pageLoaded) {

      this.fetchRestaurants();
    }


    this.getCountOfRestaurants();
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

          this.currentUserId = doc.data().userId;
        });
      });
    },

    toggleReviewBoxes(data) {

        this.currentReviewBox = data.id;
    },


    fetchRestaurants() {
      console.log(this.authorized)
      if (this.authorized) {

        this.restaurantLimit = 5;
      } else {

        this.restaurantLimit= 2;
      }

      this.db.collection('restaurants')
      .orderBy('name')
      .limit(this.restaurantLimit)
      .get()
      .then(
        (querySnapshot) => {


        querySnapshot.forEach(
          (restaurantDoc) => {

             this.restaurants.push(restaurantDoc.data());

            if (this.authorized) {

              this.linkReviewsToRestaurants(restaurantDoc);
            }

        });
      }).catch(
        (error) => {
          console.log(error);
      });
    },

   async linkReviewsToRestaurants(restaurantDoc) {

        const promises = [];

        const reviews = await  this.db
        .collection('reviews')
        .where('restaurantId', '==', restaurantDoc.data().id)
        .get();

        for (const review of reviews.docs) {


     this.restaurants.forEach(
              (restaurant) => {

                if (restaurant.id === review.data().restaurantId) {

                    promises.push(this.setReviewAuthor(review, restaurant))
                }
             }
          );
        }
      await Promise.all(promises);
    },

    async setReviewAuthor(review, restaurant) {

      let modifiedReview;

      try {

       const user = await this.db
       .collection('users')
       .doc(review.data().userId)
      .get();

       const exists = await this.userExists(review);

            if (exists) {

              modifiedReview = review.data();

              modifiedReview.firstName =  user.data().firstName;

              modifiedReview.lastName = user.data().lastName;

              restaurant.reviews.push(modifiedReview);

            } else {

              modifiedReview = review.data();

              modifiedReview.firstName =  '(Deleted';

              modifiedReview.lastName = 'User)';

              restaurant.reviews.push(modifiedReview);
            }
      } catch (e) {

        console.log('Exception: ', e);
      }
    },

    async userExists (review) {

      let exists;

      try {

        const documents = await this.db
        .collection('users')
        .doc(review.data().userId)
        .get();

        if(documents.exists) {

          exists = true;
        }else {

          exists = false;
        }

        return exists;
      } catch (e) {

        console.log('Exeception Message: ', e.message);
      }
    },


    removeCommentFromFavorites({id, restaurantId}) {

      this.db.collection('favorites')
      .where('restaurantId', '==', restaurantId)
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

           const commentToDelete = this.getCommentToDelete(reviews, id);

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

       removeComment(data) {

         this.removeCommentFromFavorites(data);

          const targetRestaurant = this.restaurants.find(
            (restaurant) => {

              return restaurant.id === data.restaurantId;
          })

          const newListOfReviews = targetRestaurant.reviews.filter(
            (review) => {

            return review.id !== data.id;
          });

          this.recalculateAverageRating(newListOfReviews, targetRestaurant, data);

          targetRestaurant.reviews = newListOfReviews;


        this.db.collection('reviews')
        .where('id', '==', data.id)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

              this.db.collection('reviews')
              .doc(doc.id)
              .delete()
              .then(
                () => {

                this.commentDeletion = true;

              })
          });
        });
        const userRef = this.db.collection('users').doc(this.currentUserId);

        userRef.update(
          {
          reviews: firebase.firestore.FieldValue.arrayRemove(data.restaurantId)
          }
        ).then(
          () => {
          setTimeout(
            () => {

            this.commentDeletion = false;
          }, 4000);
        })
       },

        recalculateAverageRating (reviews, restaurant, data) {
        let averageRating;

        const totalRatings = reviews.reduce(
            (acc, curr) => {

            return acc + curr.rating;
          }, 0)

          if (totalRatings === 0) {

            averageRating = 0;
          } else {

           averageRating = (totalRatings / reviews.length)
            .toFixed(1)
            .toString();
          }

            restaurant.avg_rating = averageRating;


          this.db.collection('restaurants')
          .where('id', '==', data.restaurantId)
          .get()
          .then(
            (querySnapshot) => {

              querySnapshot.forEach(
                (doc) => {
                  const restaurantToUpdateRef = this.db.collection('restaurants').doc(doc.id);

                  restaurantToUpdateRef.update(
                    {
                    avg_rating: averageRating
                    }
                  )
              });
          });
      },

    loadMoreRestaurants() {

      this.restaurants.find(
        (document, index) => {

          if (this.totalDocuments === this.restaurants.length) {

            this.loader = false;
          }

          if (index === this.restaurants.length -1) {

            this.lastDocument = document.name;
          }
      });

      this.db.collection('restaurants')
      .orderBy('name')
      .startAfter(this.lastDocument)
      .limit(10)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach((doc) => {

          this.restaurants.push(doc.data());

          this.linkReviewsToRestaurants(doc);
        });
      });
    },

    getCountOfRestaurants() {

      this.db.collection('restaurants')
      .get()
      .then(
        (querySnapshot) => {

        this.totalDocuments = querySnapshot.docs.length - 1;
      });
    }
  },
}

</script>

<style  lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

  .favorite-preview {
    position: absolute;
    width: 270px;
    margin: 0;

  }
  .paginate-btn {
    text-align: center;
    margin: 2rem 0;

      button {
    color: $offwhite;
    background-color: $lightBlue;
    padding: 0.4rem 0.3rem;
    border-radius: 11px;
    border: none;
    transition: all 0.5s ease-in-out;
    width: 150px;
    cursor: pointer;
    &:hover {
      background-color: darken($lightBlue, 15);
    }
  }
  }

  .review-box-unauthorized {
    background-color: $red;
      padding: 0.6rem;
    a {
      display: block;
      margin: 0;
      text-align: center;
      color: $offwhite;
    }
  }



.add-review-link {
  a {
    display: block;
    margin: 0.5rem;
    text-align: right;
    color: $lightBlue;
    text-decoration: none;
    font-weight: bold;
  }
}





.comment-delete-message {
  color: $lightBlue;
  text-align: center;
  font-size: 1.2rem;
}

.restaurants-container {
  width: 600px;
  margin: 0 auto;
}

.review-box-container {
  position: relative;
}

.restaurants-heading {
  background-color: $lightBlue;
  color: $blue;
  padding: 0.75rem;
  header {
    h1 {
      margin:0;
      text-align: center;
    }
  }
}

.restaurant {
  border: 1px solid $gray;
  margin: 3rem 0;
  border-radius: 1rem;
  animation-name: fadein;
  animation-duration: 0.7s;
  background-image: url('../assets/restaurant.jpg');
  background-size: cover;
  background-position: center;
}







@media (max-width:600px) {
  .restaurants-container {
    width: 90%;
  }


}

@media (max-width: 1200px) {
  .favorite-preview {
    position: relative;
    margin: 0 auto;
  }
}

</style>
