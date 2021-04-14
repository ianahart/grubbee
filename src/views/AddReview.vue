<template>
  <div class="add-review">
    <header class="review-header">
      <h1>Let Us Know What You Think!</h1>
    </header>
    <div class="review-error-container">
      <p class="form-error"
        v-for="(error, index) in formErrors"
        v-bind:key="index">
      <i class="fas fa-times"></i> {{ error }}
     </p>
     </div>
    <div class="review-form-container">
      <form @submit.prevent="sendReview">
        <div class="review-form-header">
        </div>
        <div class="review-form-content">
          <div v-if="!hasRouteParam" class="review-input-group">
            <label>Restaurant Name:</label>
            <input
            @keyup="populateRestaurantName"
            type="text"
            @focus="resetErrors"
            v-model="restaurantNameInput"/>
            <div v-if="restaurantNameInput && isTypeAheadShowing" class="autocomplete">
                <p @click="selectName(query)" v-for="(query, index) in typeAhead" :key="index">{{ query }}</p>
            </div>
          </div>
          <div class="review-input-group">
            <label>Your Message:</label>
            <textarea @focus="captureName" v-model="messageInput"></textarea>
          </div>
        </div>
        <StarRating
        @starRating="setStarCount"
        v-bind:ratings="ratings" />
        <div class="review-button-container">
          <button>Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import StarRating from '../components/StarRating';
import { v4 as uuidv4 } from 'uuid';

  export default {
    name: 'AddReview',
    components: {
      StarRating,
    },
    data() {
      return {
        restaurantNameInput: '',
        db: firebase.firestore(),
        typeAhead: [],
        hasRouteParam: false,
        restaurantId: null,
        isTypeAheadShowing: false,
        ratings: [1,2,3,4,5],
        rating: null,
        duplicateSubmission: false,
        messageInput: '',
        userId: firebase.auth().currentUser.uid,
        formErrors: [],
        averageRating: '',
        monthPosted: '',
        favoriteExists: false,
      }
    },

  mounted() {

    if (this.$route.params.id) {

      this.hasRouteParam = true;

      this.restaurantId = this.$route.params.id
    }

  },

watch: {

    $route(to, from) {

    if(to !== from){

       this.hasRouteParam = false;

       this.restaurantId = null;

       }
     }
  },

    methods: {

        captureName () {

          if (!this.hasRouteParam) {

               this.db.collection('restaurants')
               .where('search', '==', this.restaurantNameInput)
               .get()
               .then(
                 (querySnapshot) => {

               querySnapshot.forEach(
                 (doc) => {

              this.restaurantId = doc.data().id;
            });
          });
          }
        },
        addReviewAuthor() {

          const userRef = this.db.collection('users').doc(this.userId);

          userRef
          .get()
          .then(
            (doc) => {
            if (doc.exists) {

              const matchFound = doc.data().reviews.find(

                (review) => {

                 return review === this.restaurantId;
               });

                if (matchFound) {

                  this.duplicateSubmission = true;

                  this.formErrors.push('You have already submitted a review for this restaurant');
                } else {

                   userRef.update(
                  {
                  reviews: firebase.firestore.FieldValue.arrayUnion(this.restaurantId)
                  }
                )

                if (this.duplicateSubmission) {

                    this.validateReviewForm();

                } else {

                   this.addReviewToCollection();
                }
              }
            }
          });

        },

         sendReview() {

        this.formErrors = [];

        this.validateReviewForm();

        if (!this.formErrors.length) {

            this.addReviewAuthor();

        }

      },

      calculateAverageRating(id) {
           const ratings = [];

          this.db.collection('reviews')
          .where('restaurantId', '==', id)
          .get()
          .then(
            (querySnapshot) => {

            querySnapshot.forEach(
            (doc) => {

              ratings.push(doc.data().rating);

             this.averageRating = ratings.reduce(
               (acc, curr) => {

                return acc + curr;
              }, 0);

              this.averageRating = this.averageRating / ratings.length;

          });
        });

        this.handleUpdateAverageRatings('restaurants', id, 'id')
        .then(
          () => {

          this.handleUpdateAverageRatings('favorites', id, 'restaurantId');
        })
        .then(
          () => {

           this.$router.push('/restaurants');
        })

      },

      handleUpdateAverageRatings(collection, value, field) {

        return this.db.collection(collection)
        .where(field, '==', value)
        .get().then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {
            const docRef =  this.db.collection(collection).doc(doc.id);

                docRef.update(
                {
                avg_rating: this.averageRating.toFixed(1).toString(),
                }
              )
          });
        });
      },










      addReviewToCollection() {

        if (this.restaurantId) {

          this.db.collection('restaurants')
          .where('id', '==', this.restaurantId)
          .get()
          .then(
            (querySnapshot) => {

            querySnapshot.forEach(
              (doc) => {

              this.restaurantNameInput = doc.data().name;

              if (this.restaurantNameInput) {

                  this.add();

              }
            });
          })
          .catch(
            (error) => {
            console.log(error);
          })

        } else {

          this.db.collection('restaurants')
          .where('search', '==', this.restaurantNameInput.toLowerCase())
          .get()
          .then(
            (querySnapshot) => {

            querySnapshot.forEach(
              (doc) => {

                this.restaurantId = doc.data().id;

                if (this.restaurantId) {

                    this.add();

                }
            })
            })
            .catch(
              (error) => {

                console.log(error);
          });
        }
      },

      add () {

          const review =  {
            createdAt:     firebase.firestore.Timestamp.fromDate(new Date()),
            name:          this.restaurantNameInput,
            text:          this.messageInput,
            userId:        this.userId,
            rating:        this.rating,
            restaurantId:  this.restaurantId,
            id:            uuidv4(),
            monthPosted:   this.getCurrentMonth()
          };

          this.db.collection('reviews').add(review)
        .then(
          () => {

              this.calculateAverageRating(this.restaurantId);

              this.addCommentToFavorites(review);

        });
      },
      resetErrors() {
        this.formErrors = [];
      },

      addCommentToFavorites(review) {

        this.db.collection('favorites')
        .where('restaurantId', '==', this.restaurantId)
        .get()
        .then(
          (querySnapshot) => {

          if (querySnapshot.docs.length > 0) {

            this.favoriteExists = true;
          }

          querySnapshot.forEach((doc) => {
            if (this.favoriteExists) {

              const favoriteToUpdateRef = this.db.collection('favorites').doc(doc.id);

              favoriteToUpdateRef.update({
                reviews: firebase.firestore.FieldValue.arrayUnion(review)
              });
            }
          });
        });
      },

      validateReviewForm() {

        if (!this.hasRouteParam) {

          if(!this.restaurantNameInput.length) {

            this.formErrors.push('You must provide a valid name');
          }

        }

        if (!this.messageInput.length) {

          this.formErrors.push('You must provide a message');
        } else if (this.messageInput.length < 20) {

          this.formErrors.push('Your message must be atleast 20 characters');
        }

        if (!this.rating) {

          this.formErrors.push('Please rate this review');
        }

      },

      getCurrentMonth() {

        const today = new Date();

        const month = today.getMonth() + 1;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const currentMonth = monthNames[month - 1];

        return currentMonth;
      },

      setStarCount (count) {

        this.rating = count;
      },

      selectName(query) {

        this.restaurantNameInput = query;

        this.isTypeAheadShowing = false;
      },

      populateRestaurantName(e) {

        if (!this.restaurantNameInput.length) {
          this.typeAhead = [];
        }

        const matchFound = this.typeAhead
        .find(
          (name) => {

          return name.toLowerCase() === this.restaurantNameInput.toLowerCase();
        });

        if (matchFound) {

          this.typeAhead = [matchFound];
        } else {

            if (this.typeAhead.length >= 5) {

              this.typeAhead = [];
            }

            if (e.key !== 'Backspace') {

                    this.initTypeAhead();
            }
        }
      },

      initTypeAhead() {

      if (!this.isTypeAheadShowing) {

        this.isTypeAheadShowing = true;
      }

      this.db.collection('restaurants')

        .orderBy('search')
        .startAt(this.restaurantNameInput)
        .endAt(this.restaurantNameInput + '\uf8ff')
        .limit(5).
        get().
        then(
          (querySnapshot) => {

          querySnapshot.forEach((doc) => {

            if (this.typeAhead.length < 5) {

              if (!this.typeAhead.includes(doc.data().search)) {

                  this.typeAhead.push(doc.data().name.toLowerCase());
              }

            }
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

.review-error-container {

  text-align: center;
  margin-top: 3rem;
  p {
    margin: 0;
    margin-bottom: 0.2rem;
  }
}

.review-form-header {
  background-color: $red;
  height: 50px;
}

.review-form-content div:first-of-type {
  position: relative;
}

.autocomplete {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  border: 1px solid $gray;
  p {
    transition: all 0.5s ease-out;
    cursor: pointer;
    padding-left: 0.2rem;
    font-size: 0.8rem;
    &:hover {
      font-size: 1rem;
    }
    &:after {
    display: block;
    content: '';
    border-bottom: solid 3px $red;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    transform-origin: 0% 50%;
    }
    &:hover:after {
      transform: scaleX(0.4);
    }

  }
}


.review-form-container {
  width: 600px;
  margin: 0 auto;
  border: 1px solid #eee;
  margin-top: 5rem;
  border-radius: 0.25rem;
}

.review-button-container {
  margin: 1.5rem;
  text-align: right;
  button {
    width: 100px;
    padding: 0.3rem 0.4rem;
    border-radius: 11px;
    background-color: $lightBlue;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    color: $offwhite;
    border: none;
    &:hover {
      background-color: darken($lightBlue, 10);
    }
  }
}

.review-input-group {
  padding: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  label {
    color: $blue;
    margin-bottom: 0.3rem;
  }

  input {
    height: 30px;
    border: none;
    border: 1px solid $gray;
    border-radius: 11px;
  }

  textarea {
    border: none;
    border: 1px solid $gray;
    height: 100px;
    border-radius: 11px;
  }
}

.review-header {

  h1 {
    background-color: $blue;
    margin: 0;
    color: $offwhite;
    text-align: center;
    padding: 0.5rem;
  }
}

@media (max-width: 600px) {
  .review-form-container {
    width: 90%;
  }
}
</style>