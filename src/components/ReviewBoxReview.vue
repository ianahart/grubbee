<template>
<div class="review-content">
      <transition name="flag-modal">
        <FlagCommentModal
            :alreadyFlagged="alreadyFlagged"
            @closeFlag="handleCloseFlag"
            v-if="flagClicked && !alreadyFlagged"
            :review="review"
            :userId="currentUserId"
            :currentUserName="currentUserName"
          />
     </transition>
    <div class="review-row">
      <div class="review-left-column">
        <h4><i class="fas fa-user"></i> <span>{{review.firstName}}</span> <span>{{ review.lastName }}</span></h4>
        <h5><i class="far fa-clock"></i> {{ makeReadableDate(review.createdAt) }}</h5>
        <div class="stars-rating">
          <i
          v-for="(star, index) in stars"
          v-bind:key="index"
          :class="`fas fa-star ${review.rating > index ? 'highlight-star' : ''}`"
          ></i>
        </div>
      </div>
      <div class="review-right-column">
        <div v-if="currentUserId === review.userId">
          <button
          class="remove-comment-btn"
          @click="deleteComment(review.id, review.restaurantId)"
          >Remove Comment
          </button>
        </div>
        <FlagCommentBtn
          :userId="currentUserId"
          :review="review"
          :alreadyFlagged="alreadyFlagged"
          @openFlag="handleOpenFlag"
          />
      </div>
    </div>
    <p class="review-text">{{ review.text }}</p>
</div>
</template>

<script>
import { firebase } from '@firebase/app';

import FlagCommentBtn from './FlagCommentBtn';
import FlagCommentModal from './FlagCommentModal';

import * as dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {
  name: 'ReviewBoxReview',
  props: {
    review: Object,
  },
  components: {
    FlagCommentBtn,
    FlagCommentModal,

  },

  data () {
    return {
        currentUserName: null,
        stars: [1, 2, 3, 4, 5],
        db: firebase.firestore(),
        isToolTipShowing: false,
        flagClicked: false,
        alreadyFlagged: false,
        currentUserId: firebase.auth().currentUser.uid,


    }
  },

   mounted() {

      this.getCurrentUserName();
    },

  methods: {

       handleOpenFlag({ click }) {

          this.checkIfAlreadyFlagged().then(() => {

                this.flagClicked = click;
          })
        },


  handleCloseFlag({ click}) {

    this.flagClicked = click
  },

    getCurrentUserName() {

      this.db.collection('users')
      .where('userId', '==', firebase.auth().currentUser.uid)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {

          const fullName = doc.data().firstName + ' ' + doc.data().lastName;

          this.currentUserName = fullName;
        });
      })
      .then(
        () => {

        this.checkIfAlreadyFlagged();
      });
    },


    checkIfAlreadyFlagged() {

        return this.db.collection('flagged_comments')
        .where('flagger', '==', this.currentUserName)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

              if(doc.data().reviewId === this.review.id && doc.data().markAsRead === false) {

                this.alreadyFlagged = true;
              }
          });
        })
    },

      makeReadableDate(date) {

      dayjs().fromNow()

      let time = dayjs(date.toDate()).fromNow(true)

      return `${time} ago`;
    },

     deleteComment(id, restaurantId) {

          this.$emit('sendRemove', {
              id,
              restaurantId,
          });
      }
},

}


</script>

<style lang="scss">


</style>