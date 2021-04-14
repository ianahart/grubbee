<template>

  <div
  @mouseover="zoomComment"
  @mouseleave="zoomOutComment"
  :class="`admin-comment ${commentActive ? 'active-comment' : 'not-active-comment'}`"
  >
    <CommentModal
        @close="cancelModal"
        @confirm="confirmModal"
        :isModalOpen="isModalOpen"
        :comment="comment"
       />
    <div class="admin-comment-top">
      <div>
        <h3><img class="admin-comment-user-icon" src="../assets/user.svg" />{{ comment.email }}</h3>
        <h3 class="admin-comment-date"><img src="../assets/calendar.svg" />{{ comment.formattedDate }}</h3>
        <div class="admin-comment-stars">
          <i v-for="(star, index) in stars" v-bind:key="index" :class="`fas fa-star ${index < comment.rating ? 'highlight-star': ''}`"></i>
        </div>
      </div>
      <div
           v-if="commentActive"
           @mouseover="revealToolTip"
           @mouseleave="hideToolTip"
          class="admin-delete-comment"
          >
          <div>
            <transition name="fade-tooltip">
              <p v-if="toolTipShowing">Delete this Comment</p>
          </transition>
          </div>
         <div class="image-flex">
            <img
              @click="openModal"
              src="../assets/trash.svg" alt="trashcan"
            />
        </div>
      </div>
      </div>
      <div class="admin-comment-body">
        {{ comment.text }}
      </div>
  </div>

</template>



<script>
import CommentModal from './CommentModal';


  export default {
    name: 'AdminComment',
    components: {

      CommentModal,
    },
    props: {
      comment: Object,
    },
    data() {
      return {
        stars: [1,2,3,4,5],
        toolTipShowing: false,
        commentActive: false,
        isModalOpen: false,
      }
    },

    methods: {
      adminDeleteComment(comment) {
        this.$emit('delete', {

            comment
        });
      },

      revealToolTip () {

        this.toolTipShowing = true;
    },

    hideToolTip () {

      this.toolTipShowing = false;
    },

    zoomComment() {

      this.commentActive = true;
    },

    zoomOutComment() {

      this.commentActive = false;
    },

    openModal() {

      this.isModalOpen = true;
    },

    cancelModal(payload) {
      this.isModalOpen = payload.action;
    },

    confirmModal(payload) {
      this.isModalOpen = payload.action.action;
      const {commentId, commentUserId, restaurantId} = payload.action;

      this.$emit('delete', {
        commentId,
        commentUserId,
        restaurantId

      });
    }


    },
  }

</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

/****TRANSITIONS****/
.fade-tooltip-enter-active, .fade-tooltip-leave-active {
  transition: opacity  .5s;
}

.fade-tooltip-enter, .fade-tooltip-leave-to {
  opacity: 0;
}




/****END TRANSITIONS****/

.highlight-star {
  color: orange;
}


.image-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 3rem;
}

.active-comment {
  transition:  all 0.5s ease-in-out;
  transform: scale(1.15);
  box-shadow: 3px 3px 5px 0px rgba(50, 50, 50, 0.75);
  z-index: 1;
  position: relative;
}

.not-active-comment {
  transition:  all 0.5s ease-in-out;
  transform: scale(1);
}


.admin-delete-comment {
  display: flex;
  justify-content: space-around;

  p {
    background-color: $gray;
    font-size: 0.75rem;
    padding: 0.3rem 0.1rem;
    position: relative;
    font-weight: bold;
    &::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 90%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: $gray transparent transparent transparent;
    }
  }
}




.admin-comment-top {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.admin-comment-body {
  padding: 1rem;
}

.admin-comment {
  border-top: 1px solid $gray;
  width: 90%;
  background-color: #fff;
  margin: 0.75rem auto;
  position: relative;
}

.admin-comment-date {
  display: flex;
  align-items: center;
  color: gray;
  font-style: italic;
  font-size: 0.9rem;
  img {
    margin-right: 0.5rem;
  }
}

.admin-delete-comment {
  img {
    cursor: pointer;
  }
}

.admin-comment-user-icon {
  margin-right: 0.5rem;
}

</style>