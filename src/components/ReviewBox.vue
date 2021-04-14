<template>
  <div  class="review-box">

    <div @click="toggleReviews(reviewBoxId)" class="reviews-count">
       <h3>Reviews ({{ reviews.length }}) <i v-if="reviews.length > 0" class="fas fa-sort-down"></i></h3>
    </div>
      <div v-if="isReviewShowing">
        <transition name="fade" appear>
  <div v-if="currentReviewBox === reviewBoxId || currentReviewBox === ''" class="reviews">
     <div class="review">
       <div class="hide-reviews">
         <button v-if="reviews.length" @click="hide"><i class="fas fa-sign-out-alt"></i> Exit</button>
          <p  v-if="pages.length">Page {{ this.currentPage }} of {{ this.pages.length }}</p>
       </div>
       <transition-group name="list-fade" tag="li">

        <li v-for="review in paginatedReviews" :key="review.id">
            <ReviewBoxReview
              :review="review"
              @sendRemove="handleSendRemove"
             />
          </li>
      </transition-group>
    </div>
    <div class="pagination">
      <span v-bind:class="activePageIndex(page)" @click="goToNextPage(page)" v-for="(page, index) in pages" v-bind:key="index">{{ page }}</span>
    </div>
  </div>
  </transition>
  </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import * as dayjs from 'dayjs'
import ReviewBoxReview from './ReviewBoxReview';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

  export default {
    name: 'ReviewBox',
    components: {
      ReviewBoxReview

    },
    props: {
      reviews: Array,
     reviewBoxId: String,
     currentReviewBox: String,
    },



    data () {
      return {
        db: firebase.firestore(),
        currentUserId: firebase.auth().currentUser.uid,
        restaurantId: '',
        isReviewShowing: false,
        commentsPerPage: 3,
        pages: [],
        currentReview: '',
        reviewCount: 3,
        currentPage: 1,
        startAt: 0,

      }
    },

    computed: {
        paginatedReviews: function () {

              let offset;

              if (this.reviewCount === 3 && this.currentPage === 1) {

                offset = this.reviews.slice(this.startAt, this.reviewCount);
              } else {

                offset = this.reviews.slice(this.startAt, this.reviewCount);
              }

            return offset;

          },
    },

    methods: {

      handleSendRemove({id, restaurantId}) {
        this.$emit('remove', {
          id,
          restaurantId
        });
      },


        goToNextPage (page) {

          this.currentPage = page;

          this.reviewCount = page * this.commentsPerPage;

          this.startAt = page * this.commentsPerPage - 3;
        },

        hide () {

         this.isReviewShowing = !this.isReviewShowing;
        },

          activePageIndex (page) {
        return {
              'active-index': page === this.currentPage,
        }

        },

        calculateCommentPages () {

          const numberOfPages = this.reviews.length / this.commentsPerPage;

          let result;

          if (Number.isInteger(numberOfPages)) {

            result = numberOfPages;
          } else {

            result = Math.floor(numberOfPages + 1).toString()
          }

          for (let i = 1; i <= result; i++) {

            this.pages.push(i);
          }
        },

        toggleReviews(id) {
            if (this.reviews.length) {

              this.isReviewShowing = true;

              if (this.pages.length <= 0) {

                  this.calculateCommentPages();
              }


              this.$emit('toggle', {
                  id
              });
            }
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

.reviews-count {
    position: relative;
    cursor: pointer;
  h3 {
    margin: 0;
    text-align: center;
    padding: 0.4rem;
    background-color: lighten($red, 10);
    color: $offwhite;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darken($red, 10);
    }

  }
}


.active-index {
  transition: all 0.5s ease-in-out;
  font-size: 1.3rem;
  color: $lightBlue;
  font-weight: bold;
  text-decoration: underline;
}

.hide-reviews {
  margin-left: 1rem;
  margin-top: 1rem;
  p {
    color: $gray;
    text-decoration: underline;
    font-weight: bold;
  }
  button {
    border: none;
    color: $red;
    background-color: $offwhite;
    width: 60px;
    border-radius: 11px;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      color: darken($red, 10);
      background-color: darken($offwhite, 10);
    }
  }
}

.pagination {
  padding-bottom: 0.3rem;
  text-align: center;
  span {
    margin: 0.3rem;
    cursor: pointer;
    font-weight: bold;
  }
}

/*** REVIEWS TRANSITIONS ***/
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease-in;


}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(-200px);
}

.list-fade-enter-active, .list-leave-active {
  transition: all 0.5s ease-in;
}

.list-fade-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

/*** END REVIEWS TRANSITIONS ***/

.review-box {
  position: relative;
}

.review-text {
  margin-bottom: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.reviews {
  position: absolute;
  top: 50;
  left: 0;
  z-index: 1;
  margin-bottom: 1rem;
  width: 600px;
  color: $offwhite;
  background-color: rgba(0, 0, 0, 0.7);
  h3 {
    background-color: transparent;
    span {
      background-color: transparent;
    }
  }
}

.remove-comment-btn {
  border: none;
  background-color: transparent;
  color: $red;
  font-weight: bold;
  font-size: 0.6rem;
  border: 1px solid $red;
  padding: 0.3rem 0.4rem;
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.5s ease-out;
    &:hover {
      background-color: $gray;
      border-color: $gray;
    }
}

li {
  list-style-type: none;
}

.highlight-star {
  color: orange;
}

.review-row {
   display: flex;
  justify-content: space-between;
}

.review {
  .review-content {
     padding: 1rem;

  border-bottom: 1px solid gray;
  }
  h4, h5 {
    margin: 0.2rem 0;
  }
  h5 {
    font-style: italic;
    color: $gray;
  }
}



@media (max-width:600px) {
  .reviews {
    width: 100%;
  }
}

</style>