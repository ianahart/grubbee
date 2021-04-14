<template>
  <div ref="commentContainer" class="admin-comment-search-results">
      <transition name="fade-results">
        <div v-if="comments.length" class="search-term">
          <p v-if="deleteNotification" class="delete-success-msg">You successfully deleted a comment</p>
          <p v-if="!deleteNotification && comments.length">You searched for <span>{{ searchTerm }}</span></p>
          <p v-if="!deleteNotification"><span>({{ totalNumOfComments }})</span> comments</p>
        </div>
      </transition>
     <AdminComment
      @delete="deleteComment"
      v-for="comment in comments" v-bind:key="comment.id"
      :comment="comment"
     />
     <div
      @click="loadMoreComments"
      v-if="totalNumOfComments > 5 && totalNumOfComments !== this.comments.length"
      class="load-more-search-comments"
      > <transition name="load-more">
          <button v-if="scrollAtBottom"><img src="../assets/loader.svg" alt="loader"/>Load More</button>
      </transition>
     </div>
  </div>

</template>


<script>
import {firebase} from '@firebase/app';
import AdminComment from './AdminComment';


export default {
  name: 'AdminCommentSearchResults',
  components: {
    AdminComment
  },
  props: {
    searchTerm: String,
  },

  data() {

    return {
      db: firebase.firestore(),
      comments: [],
      userId: '',
      totalNumOfComments: 0,
      resultsChanged: false,
      deleteNotification: false,
      scrollAtBottom: false,
      favoriteCommentExists: false
    }
  },

  created() {

    this.setUserId().then(
      () => {
      this.getSearchResults();

    })

  },

  mounted() {

    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {

    window.removeEventListener('scroll', this.handleScroll);
  },

  watch: {
    searchTerm: function () {

        this.setUserId()
        .then(
        () => {
        this.getSearchResults();
      })
    },

   deleteNotification: function () {

     setTimeout(
       () => {

       this.deleteNotification = false;
     }, 3000);
   }


  },

  methods: {

    handleScroll() {

      const el = this.$refs.commentContainer.getBoundingClientRect();

      if (window.innerHeight > el.bottom) {

         this.scrollAtBottom = true;
      } else {

        this.scrollAtBottom = false;
      }
    },

    setUserId () {

      return this.db.collection('users')
      .where('email', '==', this.searchTerm)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {

          this.userId = doc.data().userId;
        });
      });
    },

    getSearchResults() {

        this.comments = [];

        this.db.collection('reviews')
        .where('userId', '==', this.userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach((doc) => {

            const comment = doc.data();

            this.makeReadableDate(comment);

            comment.email = this.searchTerm;

            this.comments.push(comment);

          });
        })
        .then(
          () => {

          this.getTotalNumUserComments();

          this.resultsChanged = false;

        });
    },

    makeReadableDate(comment) {

      const months = ['jan', 'dec', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

      const firebaseDate = comment.createdAt
      .toDate()
      .toString()
      .split(' ');

      const formattedDate = firebaseDate.slice(1, 4);

      formattedDate[0] = months.indexOf(formattedDate[0].toLowerCase()) - 1;

      if (formattedDate[0] === 0) {

          formattedDate[0] = '12';
      }

      comment.formattedDate = formattedDate.join('/');

      return comment;

    },

    getTotalNumUserComments() {

      return this.db.collection('reviews')
        .where('userId', '==', this.userId)
        .get()
        .then(
          (querySnapshot) => {

            this.totalNumOfComments = querySnapshot.docs.length;
        })
    },

    deleteComment (payload) {

      this.deleteNotification = true;

      if (this.totalNumOfComments > 0) {

        this.totalNumOfComments = this.totalNumOfComments - 1;
      }

      const {commentId, commentUserId, restaurantId} = payload;

      this.comments = this.comments.filter(

        (comment) => {

          return comment.id !== commentId;
      });

      this.removeCommentFromFavorites(commentId, restaurantId);

      this.db.collection('reviews')
      .where('id', '==',commentId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {

          this.db.collection('reviews').doc(doc.id).delete();
        });
      });

      this.db.collection('users')
      .where('userId', '==', commentUserId)
      .get()
      .then(
        (querySnapshot) => {

         querySnapshot.forEach((doc) => {

           const userRef = this.db.collection('users').doc(doc.id);

            userRef.update(
              {
                reviews: firebase.firestore.FieldValue.arrayRemove(restaurantId)
              }
            )
         });
      })
    },

     removeCommentFromFavorites(id, restaurantId) {

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


    loadMoreComments() {
        const lastCommentOnPage = this.comments[this.comments.length - 1];

      this.db.collection('reviews')
      .where('userId', '==', this.userId)
      .orderBy('createdAt', 'desc')
      .startAfter(lastCommentOnPage.createdAt)
      .limit(5)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {
              const comment = doc.data();

            this.makeReadableDate(comment);

            comment.email = this.searchTerm;

            this.comments.push(comment);
        });
      })
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

.fade-results-enter-active, .fade-results-leave-active {
  transition: all 0.7s ease-in-out;
}

.fade-results-enter, .fade-results-leave-to {
  opacity: 0;
  transform: translateY(100px);
}


.load-more-enter-active, .load-more-leave-active {
  transition: all 1.3s ease-in-out;
}

.load-more-enter, .load-more-leave-to {
  opacity: 0;
  transform: translateY(-200px);
}

//****END TRANSITIONS****/

.search-term {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .delete-success-msg {

    color: gray;
  }
  p {
    color: $black;
  }

  span {
    color: $lightBlue;
    font-weight: bold;
  }
}

.admin-comment-search-results {
    border: 1px solid $gray;
  width: 600px;
  margin: 0 auto;
  border-radius: 11px;
  background-color: $gray;
  position: relative;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.load-more-search-comments {
  display: flex;
  justify-content: center;
  margin: 2rem 0;

  button {
    display: flex;
    align-items: center;
    font-size: 1rem;
    cursor: pointer;
    border:none;
    color: $offwhite;
    background-color: $red;
    border-radius: 11px;
    width: 120px;
  }

  img {
    margin-right: 0.2rem;
  }

}


@media (max-width: 600px) {
  .admin-comment-search-results {
    width: 90%;
  }
}


</style>