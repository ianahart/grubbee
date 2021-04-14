<template>
    <div
      :class="commentStyles"
      @mouseover="revealButtons"
      @mouseleave="concealButtons"
      ref="archivedComment"
    >
      <AdminArchivedCommentModal
        :isModalOpen="isModalOpen"
        :email="archivedComment.email"
        @modalAction="handleModalAction"
        :commentID="archivedComment.id"
        @delete="sendDeleteToComments"
      />
      <div class="admin-archived-comment-top-row">
          <AdminCommentField
            icon="fas fa-archive"
            :field="archivedComment.formattedArchivedAt"
            compClass="admin-archived-comment-archived-date"
            toolTipText="Date archived"
            toolTipPosition="right"
          />
        <div class="admin-archived-comment-top-main">
          <div class="admin-archived-comment-names">
              <AdminCommentField
                icon="fas fa-pen"
                :field="archivedComment.email"
                compClass="admin-archived-comment-author"
                toolTipText="Email"
                toolTipPosition="right"
              />
              <AdminCommentField
                icon="fas fa-flag"
                :field="archivedComment.flagger"
                compClass="admin-archived-comment-flaggedby"
                toolTipText="Flagged by"
                toolTipPosition="right"
              />
          </div>
          <div class="admin-archived-comment-dates">
              <AdminCommentField
                icon="fas fa-map-pin"
                :field="archivedComment.formattedPostedAt"
                compClass="admin-archived-comment-date-posted"
                toolTipText="Date posted"
                toolTipPosition="left"
              />
              <AdminCommentField
                icon="fas fa-exclamation-triangle"
                :field="archivedComment.formattedFlaggedDate"
                compClass="admin-archived-comment-date-flagged"
                toolTipText="Date flagged"
                toolTipPosition="left"
              />
          </div>
        </div>
      </div>
      <div class="admin-archived-comment-middle-row">
        <div class="admin-archived-comment-flagged-reason">
          <p>Reasons:</p>
          <p>{{ archivedComment.flagReason }}</p>
        </div>
      </div>
      <div class="admin-archived-comment-bottom-row">
        <h3 class="admin-archived-comment-flagged-restaurant">
          {{ archivedComment.name }}
        </h3>
        <div class="admin-archived-comment-flagged-rating">
          <i
          v-for="(star, index) in stars" v-bind:key="index"
          :class="`fas fa-star ${star <= archivedComment.rating ? 'highlighted-star' : ''}`"
          >
          </i>
        </div>
        <div class="admin-archived-comment-text">
          <i class="far fa-comment"></i>
          <p>{{ archivedComment.text }}</p>
        </div>
      </div>
      <transition name="show-buttons">
        <div v-if="isButtonsShowing" class="admin-archived-comment-btn-container">
            <button @click="sendCommentToFlagged(archivedComment.id)" class="moved-flagged-archived-comment"><i class="fas fa-backward"></i> Move Back To Flagged</button>
            <button @click="openArchivedModal" class="delete-archived-comment"><i class="far fa-trash-alt"></i> Remove From Archive</button>
        </div>
      </transition>
    </div>
</template>

<script>

import AdminCommentField from './AdminCommentField';
import AdminArchivedCommentModal from './AdminArchivedCommentModal';


export default {

  name: 'AdminArchivedComment',

  components: {
    AdminCommentField,
    AdminArchivedCommentModal,

  },
  props: {
    archivedComment: Object,
  },

  data() {
    return {

      stars: [1, 2, 3, 4, 5],
      isButtonsShowing: false,
      currentWindowSize: null,
      isCommentInView: false,
      isModalOpen: false,
    }
  },

  created () {

    window.addEventListener('resize', this.handleResize);

    document.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy () {

    window.removeEventListener('resize', this.handleResize);

    document.removeEventListener('scroll', this.handleScroll);
  },

  computed: {
    commentStyles: function () {
      return {
        'admin-archived-comment conceal-admin-archived-comment-even': this.isCommentInView === false && this.archivedComment.index % 2 === 0,

        'admin-archived-comment conceal-admin-archived-comment-odd': this.isCommentInView === false && this.archivedComment.index % 2 !== 0,

        'admin-archived-comment reveal-admin-archived-comment': this.isCommentInView === true,
      }
    }
  },


  methods: {
    sendDeleteToComments ({ id }) {

        this.$emit('deleteArchivedComment', {

          id
        });
    },

    openArchivedModal() {

      this.isModalOpen = true;
    },

    handleModalAction ({ action }) {

      this.isModalOpen = action;
    },

    handleScroll () {
      const commentEl = this.$refs.archivedComment.getBoundingClientRect();

      if (commentEl.top >= 0 && commentEl.bottom <= window.innerHeight) {

         this.isCommentInView = true;
      }
    },

    handleResize() {

      if (window.innerWidth < 400) {

        this.isButtonsShowing = true;
      } else {

        this.isButtonsShowing = false;
      }
    },

    revealButtons() {

      this.isButtonsShowing = true;
    },

    concealButtons() {

      this.isButtonsShowing = false;
    },

    sendCommentToFlagged(id) {
      this.$emit('flagged', {

        id
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
.show-buttons-enter-active, .show-buttons-leave-active {
  transition: all 1s ease-in-out;


}

.show-buttons-enter, .show-buttons-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
//****END TRANSITIONS****/

.conceal-admin-archived-comment-even {
  opacity: 0;
  transition: all 0.5s ease-in-out;
  transform: translateX(200px);
}

.conceal-admin-archived-comment-odd {
  opacity: 0;
  transition: all 0.5s ease-in-out;
  transform: translateX(-200px);
}

.reveal-admin-archived-comment {
  opacity: 1;
  transition: all 1s ease-in-out;
  transform: translateX(0px);
}

.admin-archived-comment {
  position: relative;
  box-sizing: border-box;
  background-color: $black;
  z-index: 1;
  border-radius: 2px;
  margin: 1.5rem auto;
  transition: all 0.5s ease-in-out;
  width: 90%;

  &:hover {
    background-color: lighten($black, 10);
    transform: scale(1.040);
    border-radius: 11px;
    box-shadow: 2px 2px 5px 0px rgba(50, 50, 50, 0.75);
  }
  i {
    margin-right: 0.5rem;
  }

  h3 {
    font-size: 0.9rem;
    color: $gray;
  }
}


.admin-archived-comment-btn-container {
  display: flex;
  box-sizing: border-box;
  justify-content: space-evenly;
  background-color: darken($blue, 20);
  align-items: center;
  height: 75px;
  border-bottom-right-radius: 11px;
  border-bottom-left-radius: 11px;

  button {
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.3rem;
    height: 30px;
    border-radius: 11px;
    transition: all 0.5s ease-in-out;
    color: #fff;
  }

}

.delete-archived-comment {
   background-color: $red;
   &:hover {
     background-color: darken($red, 10);
   }

}

.moved-flagged-archived-comment {
  background-color: $lightBlue;
  &:hover {
    background-color: darken($lightBlue, 10);
  }
}

.admin-archived-comment-archived-date {
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    color: $gray;
  }
}

.admin-archived-comment-text {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  color: $gray;

  i {
    margin-top: 1rem;
    color: $lightBlue;
    display: block;
  }
}

.admin-archived-comment-flagged-rating {
  color: black;
  padding: 1rem;
}

.admin-archived-comment-bottom-row .admin-archived-comment-flagged-restaurant {
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  color: darken($gray, 20);

}

.admin-archived-comment-flagged-reason {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: darken($blue, 20);

  p {
    color: $red;
  }
}

.admin-archived-comment-dates {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.admin-archived-comment-top-main {
  display: flex;
  padding: 1rem;
  justify-content: space-between;

}

.admin-archived-comment-author {
  justify-content: flex-start;
  i {
    color: darken($blue, 10);
  }
}

.admin-archived-comment-date-posted {
    justify-content: flex-end;
  i {
    color: $red;
  }
}

.admin-archived-comment-date-flagged  {
    justify-content: flex-end;
  i {
    color: orange;
  }
}

.admin-archived-comment-flaggedby {
  i {
    color: darken($gray, 15);
  }
}

.admin-archived-comment-author,
.admin-archived-comment-flaggedby,
.admin-archived-comment-date-posted,
.admin-archived-comment-date-flagged  {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {


  .admin-archived-comment-top-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .admin-archived-comment-flaggedby  {
    justify-content: center;
  }
}

@media (max-width: 400px) {
  .admin-archived-comment-btn-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding: 1rem 0;
    height:100px;

    button {
      margin: 1rem 0;
    }
  }
}

</style>