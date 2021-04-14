<template>
  <div class="favorite-review">
    <transition name="flag-modal">
      <FlagCommentModal
        :alreadyFlagged="alreadyFlagged"
        @closeFlag="handleCloseFlag"
        v-if="flagClicked && !alreadyFlagged"
        :review="review"
        userId="currentUserId"
        :currentUserName="currentUserName"
      />
    </transition>
    <div class="review-decoration-top"></div>
    <div class="review-top-section">
      <div class="review-meta-info">
        <p class="review-meta-name">
          <i class="fas fa-user"></i> {{ review.userName }}
        </p>
        <p class="review-meta-time">
          <i class="far fa-clock"></i> {{ formattedTime }}
        </p>
        <span v-for="(star, index) in stars" v-bind:key="index"
          ><i
            :class="
              `fas fa-star ${review.rating >= star ? 'highlight-star' : ''}`
            "
          ></i
        ></span>
      </div>
      <div class="review-actions-container">
        <form
          v-if="currentUserId === review.userId"
          @submit.prevent="removeAuthorComment(review.id, review.restaurantId)"
        >
          <button type="submit">Remove Comment</button>
        </form>
        <FlagCommentBtn
          :alreadyFlagged="alreadyFlagged"
          @openFlag="handleOpenFlag"

          v-if="currentUserId !== review.userId"
          :review="review"
          userId="currentUserId"
        />
      </div>
    </div>
    <div class="review-body">
      <p><i class="fas fa-pen"></i> {{ review.text }}</p>
      <div class="favorite-review-underline"></div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import * as dayjs from 'dayjs';

import FlagCommentBtn from '../components/FlagCommentBtn';
import FlagCommentModal from '../components/FlagCommentModal';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export default {
  name: 'RestaurantReview',
  components: {
    FlagCommentBtn,
    FlagCommentModal,
  },
  props: {
    review: Object,
  },

  data() {
    return {
      db: firebase.firestore(),
      currentUserId: firebase.auth().currentUser.uid,
      currentUserName: null,
      isToolTipShowing: false,
      stars: [1, 2, 3, 4, 5],
      flagClicked: false,
      alreadyFlagged: false,

    };
  },

  computed: {
    formattedTime: function() {
      dayjs().fromNow();

      let time = dayjs(this.review.createdAt.toDate()).fromNow(true);

      return `${time} ago`;
    },
  },

  watch: {
    alreadyFlagged: function () {

      return this.alreadyFlagged;
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

    removeAuthorComment(id, restaurantId) {
      this.$emit('deleteComment', {
        id,
        restaurantId
      });
    },

    showFlagToolTip() {
      this.isToolTipShowing = true;
    },

    hideFlagToolTip() {
      this.isToolTipShowing = false;
    },
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
.flag-modal-enter-active, .flag-modal-leave-active {
  transition: all 0.7s ease-in-out;
}

.flag-modal-enter, .flag-modal-leave-to {
  opacity: 0;
  width: 100%;
  height: 0%;
}


//****END TRANSITIONS****/

.flag-tooltip {
  position: relative;
}

.tool-tip {
  span {
    i {
      color: orange;
    }
  }
}

.review-actions-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0.5rem;
  margin-top: 0.5rem;

  form {
    button {
      font-size: 0.6rem;
      border: 1px solid $red;
      color: $red;
      background-color: transparent;
      border-radius: 11px;
      padding: 0.2rem 0.3rem;
      cursor: pointer;
      transition: all 0.5s ease-in-out;
      &:hover {
        color: darken($red, 20);
        border-color: darken($red, 20);
        background-color: $gray;
      }
    }
  }
  p {
  }
}

.favorite-review {
  color: $black;
  position: relative;
}



.review-meta-name {
  i {
    color: $blue;
  }
}

.review-meta-time {
  font-style: italic;
  color: gray;
  font-size: 0.8rem;
}

.review-meta-info {
  padding: 0.5rem;
  p {
    margin: 0.5rem 0;
  }
}

.favorite-review-underline {
  height: 3px;
  background-color: $gray;
  width: 50%;
  margin: 0 auto;
}

.review-body {
  padding: 0.5rem;
  text-align: center;
  p {
    line-height: 1.6;
  }
  i {
    color: $blue;
  }
}

.review-top-section {
  display: flex;
  justify-content: space-between;
}

.favorite-review {
  border: 1px solid $gray;
  margin: 2rem 0;
  width: 100%;
  border-radius: 11px;
}

.review-decoration-top {
  height: 30px;
  background-color: $blue;
  border-radius: 11px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
