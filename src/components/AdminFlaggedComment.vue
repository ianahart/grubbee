<template>
  <div class="admin-flagged-comment-container">
    <transition name="fade-flagged" appear>
      <div :class="adminComment">
        <DeleteFlaggedCommentModal
        :isModalOpen="isModalOpen"
        :name="flaggedComment.name"
        :author="flaggedComment.email"
        @close="closeModal"
        :flaggedCommentID="flaggedComment.id"
        @send="handleFlaggedComment"
        />
        <div class="admin-flagged-comment-actions">
          <div class="top-actions">
            <button v-if="!markAsRead" @click="markCommentAsRead(flaggedComment.id)" class="mark-as-read-btn">Mark as Read</button>
            <p class="marked-read" v-if="markAsRead"><i class="fas fa-check"></i> Read</p>
            <button @click="openModal" class="flagged-delete-btn">Delete</button>
          </div>
          <div v-if="markAsRead" class="bottom-actions">
            <button @click="archiveComment(flaggedComment)"><i class="fas fa-box"></i>Archive Comment</button>
          </div>
        </div>
        <div class="admin-comment-flagged-top-row">
          <div class="admin-comment-names">
            <div class="admin-comment-author">
              <i :class="penIcon"></i>
              <h3>{{ flaggedComment.email }}</h3>
            </div>
            <div class="admin-comment-flaggedby">
              <i :class="flagIcon"></i>
              <h3>{{ flaggedComment.flagger }}</h3>
            </div>
          </div>
          <div class="admin-comment-dates">
            <div class="admin-comment-date-posted">
              <i :class="pinIcon"></i>
              <h3>{{ flaggedComment.formattedPostedDate }}</h3>
            </div>
            <div class="admin-comment-date-flagged">
              <i :class="warningIcon"></i>
              <h3>{{ flaggedComment.formattedFlaggedDate }}</h3>
            </div>
          </div>
        </div>
        <div class="admin-comment-flagged-middle-row">
          <div class="admin-comment-flagged-reason">
            <p>Reasons:</p>
            <p :class="reasons">{{ flaggedComment.flagReason }}</p>
          </div>
        </div>
        <div class="admin-comment-flagged-bottom-row">
          <h3 class="admin-comment-flagged-restaurant">
            {{ flaggedComment.name }}
          </h3>
          <div class="admin-comment-flagged-rating">
            <i
            v-for="(star, index) in stars" v-bind:key="index"
            :class="`fas fa-star ${star <= flaggedComment.rating ? 'highlighted-star' : ''}`"
            >
            </i>
          </div>
          <div class="admin-comment-flagged-text">
            <p>{{ flaggedComment.text }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import DeleteFlaggedCommentModal from './DeleteFlaggedCommentModal';

export default {
  name: 'AdminFlaggedComment',
  components: {
    DeleteFlaggedCommentModal,
  },
  props: {
    flaggedComment: Object,
  },

  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      markAsRead: false,
      isModalOpen: false,
    }
  },

  mounted() {

    if (this.flaggedComment.markAsRead) {

      this.markAsRead = true;
    }
  },

  computed: {
    adminComment: function () {

      return {
        'admin-flagged-comment-read': this.markAsRead,

        'admin-flagged-comment': !this.markAsRead
      }
    },

    penIcon: function () {

      return {

        'pen-icon fas fa-pen flagged-icon' : !this.markAsRead,

        'pen-icon-read  fas fa-pen flagged-icon' : this.markAsRead
      }
    },

    pinIcon: function () {

      return {

        'fas fa-map-pin flagged-icon pin-icon' : !this.markAsRead,

        'fas fa-map-pin flagged-icon pin-icon-read' : this.markAsRead,
      }
    },

    warningIcon: function () {

      return {

        'fas fa-exclamation-triangle flagged-icon warning-icon' : !this.markAsRead,

        'fas fa-exclamation-triangle flagged-icon warning-icon-read' : this.markAsRead,

      }
    },

    flagIcon: function () {

      return {

        'fas fa-flag flagged-icon flag-icon' : !this.markAsRead,

        'fas fa-flag flagged-icon flag-icon-read' : this.markAsRead,
      }
    },

    reasons: function () {

      return {

        'flagged-reason-list flagged-reason' : !this.markAsRead,

        'flagged-reason-list  flagged-reason-read' : this.markAsRead,
      }
    }
  },

  methods: {
    handleFlaggedComment ({id}) {

      this.isModalOpen = false;

      this.$emit('delete', {
        id,
      });
    },
    openModal() {

      this.isModalOpen = true;
    },

    closeModal({close}) {

      this.isModalOpen = close;
    },

    markCommentAsRead(id) {

      this.markAsRead = true;

      this.$emit('markRead', {

        id
      });
    },

    archiveComment(comment) {

      this.$emit('archive', {

        comment,
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


//****TRANSITIONS****/

.fade-flagged-enter-active, .fade-flagged-enter-leave-active {
  transition: all 1s ease-in-out;
}

.fade-flagged-enter, .fade-flagged-leave-to {
  opacity: 0;
}

//****END TRANSITIONS****/

.admin-flagged-comment-container {
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    margin: 1rem;
    padding: 1rem;
    display:flex;
    flex-direction: column;
    align-items: center;

}

.admin-flagged-comment{
    position: relative;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    color: #fff;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
}

.admin-flagged-comment-read {
  color: $black;
  height: 100%;
  position: relative;
  width: 100%;
  background-color: #fff;
  transition: all 0.5s ease-in-out;
}

.pen-icon,
.pin-icon,
.flag-icon,
.warning-icon {
  color: #fff;
}

.pen-icon-read,
.pin-icon-read,
.warning-icon-read,
.flag-icon-read {
  transition: all 0.5s ease-in-out;
}

.pen-icon-read {
  color: $blue,
}

.pin-icon-read {
  color: $red,
}

.warning-icon-read {

  color: darken($gray, 7);
}

.flag-icon-read {
  color: orange;
}


.flagged-icon {
  margin-right: 0.5rem;
}

.highlighted-star {
  color: orange;
}

.admin-flagged-comment-actions {
  margin: 1rem;
  button {
    border: none;
    transition: all 0.5s ease-in-out;
    margin: 0 0.5rem;
    padding: 0.3rem;
    width: 100px;
    color: #fff;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
}

.top-actions {
  display: flex;
  justify-content: flex-end;
}

.bottom-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  i {
    margin-right: 0.5rem;
  }
  button {
    width: 150px;
    padding: 0.3rem 0.7rem;
    background-color: $blue;

  }
}

.mark-as-read-btn {
  background-color: darken($lightBlue, 7);
}

.flagged-delete-btn {
  background-color: lighten($red, 5);
}

.marked-read {
  margin: 0;
  width: 100px;
  background-color: $gray;
  text-align: center;
  color: $black;
}

.admin-comment-flagged-top-row {
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  border-bottom: 1px solid $gray;
}

.admin-comment-author {
  display: flex;
  align-items: center;
}

.admin-comment-flaggedby {
  display: flex;
  align-items: center;
}

.admin-comment-date-posted {
  display: flex;
  align-items: center;
}

.admin-comment-date-flagged {
  display: flex;
  align-items: center;
}



.admin-comment-flagged-middle-row {

  border-bottom: 1px solid $gray;
}

.admin-comment-flagged-reason {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
}

.flagged-reason {
  color: #fff;
}

.flagged-reason-read {
  color: $red;
  transition: all 0.5s ease-in-out;
}

.flagged-reason-list {
  font-weight: 900;
  font-style: italic;

}

.admin-comment-flagged-restaurant {
  display: flex;
  justify-content: center;
}

.admin-comment-flagged-rating {
  color: black;
  padding: 1rem;
}

.admin-comment-flagged-text {
  padding: 0 1rem;
  text-align: center;
}

@media (max-width: 600px) {

  .admin-comment-flagged-top-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .admin-comment-flaggedby {
    justify-content: center;
  }

  .admin-flagged-comment-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

</style>