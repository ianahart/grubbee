<template>
  <div class="admin-flagged-comments">
     <DashBoardBackBtn />
     <div ref="bottomOfComments" class="flagged-comments-container">
       <div class="flagged-comments-container-header">
         <i class="far fa-flag"></i>
         <h1> <span>({{ newFlaggedComments }})</span> New Flagged Comments</h1>
       </div>
         <AdminFlaggedComment
          v-for="flaggedComment in flaggedComments" v-bind:key="flaggedComment.id"
          :flaggedComment="flaggedComment"
          @markRead="markCommentAsRead"
          @archive="handleArchiveComment"
          @delete="deleteFlaggedComment"
         />
         <transition name="fade-load-more">
          <div v-if="isAtBottomOfComments && !allFlaggedCommentsLoaded" class="load-more-flagged-btn">
            <button @click="loadMoreFlaggedComments"><i class="fas fa-spinner"></i> Load More...</button>
          </div>
         </transition>
     </div>
  </div>
</template>

<script>
import {firebase} from '@firebase/app';

import DashBoardBackBtn from '../../components/DashBoardBackBtn';
import AdminFlaggedComment from '../../components/AdminFlaggedComment';

export default {
  name: 'AdminFlaggedComments',
  components: {
    DashBoardBackBtn,
    AdminFlaggedComment,
  },
  data() {
    return {
      db: firebase.firestore(),
      flaggedComments: [],
      newFlaggedComments: 0,
      flaggedCommentToDelete: null,
      isAtBottomOfComments: false,
      totalFlagCommentsNum: 0,
      lastFlaggedCommentOnPage: null,
      flaggedCommentsPerPage: 5,
      allFlaggedCommentsLoaded: false,
    }
  },

  created() {

    this.getInitialFlaggedComments();

    window.addEventListener('scroll', this.handleScroll);
  },

  mounted() {

    this.calculateNewFlaggedComments();

    this.getTotalNumFlagComments();
  },

  beforeDestroy() {

    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {

    handleScroll() {

      const el = this.$refs.bottomOfComments.getBoundingClientRect();

      if (window.innerHeight > el.bottom) {

         this.isAtBottomOfComments= true;
      } else {

        this.isAtBottomOfComments = false;
      }
    },

    calculateNewFlaggedComments() {

      this.db.collection('flagged_comments')
      .where('markAsRead', '==', false)
      .get()
      .then(
        (querySnapshot) => {

          this.newFlaggedComments = querySnapshot.docs.length;
      });
    },

    getInitialFlaggedComments () {

      this.db.collection('flagged_comments')
      .orderBy('createdAt', 'desc')
      .limit(this.flaggedCommentsPerPage)
      .get()
      .then(
        (querySnapshot) => {

         this.lastFlaggedCommentOnPage = querySnapshot.docs[querySnapshot.docs.length - 1].data();

        querySnapshot.forEach(
          (doc) => {

          const data = doc.data();

          let flaggedComment = this.addFormattedDates(data);

          flaggedComment = this.formatFlagReasons(flaggedComment);

          this.flaggedComments.push(flaggedComment);
        });
      })
    },

    formatFlagReasons(comment) {

      let formattedReasons = comment.flagReason.split(',');

      if (formattedReasons.length > 2) {

         formattedReasons.splice(formattedReasons.length - 1, 0, 'and');

         formattedReasons = formattedReasons.map(
           (reason, index) => {

           if (index !== formattedReasons.length - 2 && index !== formattedReasons.length - 1) {

             return reason + ', ';

           } else {

             return reason;
           }
         }).join('');

          comment.flagReason = formattedReasons;

      }
          return comment;
    },

    addFormattedDates(comment) {

     let flaggedDate = this.formatDate(comment.createdAt);

     let postedDate = this.formatDate(comment.postedAt);

     comment.formattedFlaggedDate = flaggedDate;

     comment.formattedPostedDate = postedDate;

     return comment;
    },

    formatDate(date) {

      let dateArr = date.toDate().toString().split(' ');

      dateArr = dateArr.filter(
        (str, index) => {

          return index > 0 && index < 4 ? str : '';
      }).join(', ');

      return dateArr;
    },

    markCommentAsRead({ id }) {

        this.db.collection('flagged_comments')
        .where('id', '==', id)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

              const commentToUpdateToReadRef = this.db.collection('flagged_comments').doc(doc.id);

              commentToUpdateToReadRef.update(
                {
                  markAsRead: true,
                }
              )
              .then(
                () => {

                  this.newFlaggedComments = this.newFlaggedComments - 1;
              });
          });
        });
    },

    handleArchiveComment({ comment }) {

      this.db.collection('archived_comments').add(

        {
        createdAt: comment.createdAt,
        email: comment.email,
        flagReason: comment.flagReason,
        flagger: comment.flagger,
        formattedFlaggedDate: comment.formattedFlaggedDate,
        id:     comment.id,
        markAsRead: true,
        isArchived: true,
        name: comment.name,
        postedAt: comment.postedAt,
        rating: comment.rating,
        restaurantId: comment.restaurantId,
        reviewId: comment.reviewId,
        text: comment.text,
        archivedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        userId: comment.userId,
       }
      ).then(
        () => {

          this.removeFlaggedComment(comment.id);

      });
    },

    removeFlaggedComment(flaggedCommentID) {

      this.flaggedComments = this.flaggedComments.filter(
        (comment) => {

        return comment.id !== flaggedCommentID ? comment : '';
      });

      this.db.collection('flagged_comments')
      .where('id', '==', flaggedCommentID)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (docToDelete) => {

           this.db.collection('flagged_comments')
           .doc(docToDelete.id)
           .delete();
        });
      }).then(
        () => {
          this.totalFlagCommentsNum = this.totalFlagCommentsNum - 1;
      });
    },

    deleteFlaggedComment({ id }) {

       this.flaggedCommentToDelete = this.flaggedComments
       .find(
         (flaggedComment) => {

         return flaggedComment.id === id ? flaggedComment : '';
       });

       this.flaggedComments = this.flaggedComments.filter(

         (flaggedComment) => {

           return flaggedComment.id !== id ? flaggedComment : '';
       })

      this.removeCommentInReviewsAndFlagged(this.flaggedCommentToDelete.reviewId,'reviews');

      this.removeCommentInReviewsAndFlagged(this.flaggedCommentToDelete.id,'flagged_comments');

      this.removeCommentFromUser(this.flaggedCommentToDelete);

      this.removeCommentFromFavorites(this.flaggedCommentToDelete);

      this.newFlaggedComments = this.newFlaggedComments - 1;

      this.totalFlagCommentsNum = this.totalFlagCommentsNum - 1;


    },

    removeCommentInReviewsAndFlagged(commentId, collection) {

      this.db.collection(collection)
      .where('id', '==', commentId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach((doc) => {

          this.db.collection(collection)
          .doc(doc.id)
          .delete();

        });
      });
    },

    removeCommentFromUser(comment) {

      this.db.collection('users')
      .where('userId', '==', comment.userId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach((doc) => {

          const userToUpdateRef = this.db.collection('users').doc(doc.id);

          userToUpdateRef.update(
            {
              reviews: firebase.firestore.FieldValue.arrayRemove(comment.restaurantId)
            }
          );
        });
      });
    },

    removeCommentFromFavorites(comment) {

      this.db.collection('favorites')
      .where('restaurantId', '==', comment.restaurantId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach((doc) => {

            const restaurantToUpdateRef = this.db.collection('favorites').doc(doc.id);

            const commentToRemove = doc.data().reviews.find(

              (review) => {

            if(review.id === comment.reviewId) {
              return review;
            }
          })

          restaurantToUpdateRef.update(
            {
              reviews: firebase.firestore.FieldValue.arrayRemove(commentToRemove),
            }
          )
        });
      });
    },

    getTotalNumFlagComments() {

      this.db.collection('flagged_comments')
      .get()
      .then(
        (querySnapshot) => {

        this.totalFlagCommentsNum = querySnapshot.docs.length;
      });
    },

    loadMoreFlaggedComments () {

      this.db.collection('flagged_comments')
      .orderBy('createdAt', 'desc')
      .startAfter(this.lastFlaggedCommentOnPage.createdAt)
      .limit(this.flaggedCommentsPerPage)
      .get()
      .then(
        (querySnapshot) => {

        this.lastFlaggedCommentOnPage = querySnapshot.docs[querySnapshot.docs.length - 1].data();

        querySnapshot.forEach((doc) => {

          const data = doc.data();

          let flaggedComment = this.addFormattedDates(data);

          flaggedComment = this.formatFlagReasons(flaggedComment);

          this.flaggedComments.push(flaggedComment);
        });
      })
      .then(
        () => {

          if (this.flaggedComments.length === this.totalFlagCommentsNum) {
            this.allFlaggedCommentsLoaded = true;
          }
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

//****TRANSITIONS****/
.fade-load-more-enter-active, .fade-load-more-leave-active {
  transition: all 0.7s ease-in-out;
}

.fade-load-more-enter, .fade-load-more-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
//****END TRANSITIONS****/


.flagged-comments-container {
  width: 800px;
  background-color: lighten($gray, 2);
  border-radius: 11px;
  margin: 0 auto;
  margin-top: 5rem;
  margin-bottom: 5rem;
  height: 100%;

}

.load-more-flagged-btn {
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;

  button {
    background-color: $red;
    border: none;
    color: #fff;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    padding: 0.2rem 0.3rem;
    width: 150px;
    height: 30px;
    border-radius: 11px;
    box-shadow: 2px 2px 4px 0px rgba(50, 50, 50, 0.75);
    &:hover {
      background-color: darken($red, 8);
    }
  }
}

.flagged-comments-container-header {
    display: flex;
    justify-content: center;
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
    align-items: center;
    background-color: $blue;

    h1 {
      color: $offwhite;
      span {
        color: $red;
      }
    }

    i {
      color: orange;
      font-size: 2rem;
      margin-right: 1rem;
    }
}

@media(max-width: 784px) {
  .flagged-comments-container {
    width: 90%;
    margin: 0 auto;
  }

  .flagged-comments-container-header h1 {
    font-size: 1.5rem;
  }

  .flagged-comments-container-header i {
    font-size: 1.5rem;
  }
}


</style>