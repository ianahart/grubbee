<template>
  <div class="admin-comments">
    <div class="admin-page-actions">
      <DashBoardBackBtn />
      <transition name="fade-link">
        <AdminCommentViewChangeBtn
          v-if="!isListComponentShowing"
          view="list"
          @toggleView="toggleListComponent"
          fileName="list"
          alt="list"
          text="List Comments"
        />
      </transition>
      <transition name="fade-link">
        <AdminCommentViewChangeBtn
          v-if="!isSearchComponentShowing"
          @toggleView="toggleSearchComponent"
          view="search"
          fileName="search"
          alt="search glass"
          text="Search By Email"
        />
      </transition>
   </div>
    <div v-if="isSearchComponentShowing" class="admin-search-comments-container">
      <AdminCommentSearch
        @search="setSearchedEmail"
      />
      <AdminCommentSearchResults
        @search="setSearchedEmail"
        v-if="searchedEmail"
        :searchTerm="searchedEmail"
      />
    </div>
    <div v-if="isListComponentShowing" class="admin-comments-container">
      <transition name="slide-dates">
        <div v-if="datesLoaded" class="comment-between-dates">
          <img src="../../assets/clock.svg" alt="clock" />
          <p class="">{{ betweenDates }}</p>
        </div>
      </transition>
      <AdminComment
        @delete="handleDeleteComment"
        v-for="comment in comments" v-bind:key="comment.id"
        :comment="comment"
      />
      <AdminCommentPagination
        @sort="paginateComments"
        :isLastPage="isLastPage"
        :isFirstPage="isFirstPage"
      />
    </div>
    </div>
</template>



<script>
import {firebase} from '@firebase/app';

import DashBoardBackBtn from '../../components/DashBoardBackBtn';
import AdminComment from '../../components/AdminComment';
import AdminCommentPagination from '../../components/AdminCommentPagination';
import AdminCommentViewChangeBtn from '../../components/AdminCommentViewChangeBtn';
import AdminCommentSearch from '../../components/AdminCommentSearch';
import AdminCommentSearchResults from '../../components/AdminCommentSearchResults';



  export default {
    name: 'AdminComments',
    components: {
      DashBoardBackBtn,
      AdminComment,
      AdminCommentPagination,
      AdminCommentViewChangeBtn,
      AdminCommentSearch,
      AdminCommentSearchResults
    },

    data() {
      return {
          db: firebase.firestore(),
          comments: [],
          commentsPerPage: 10,
          firstCommentOnPage:null,
          lastCommentOnPage: null,
          pages: [],
          sortOrder:null,
          isLastPage: false,
          isFirstPage: true,
          currentPage: 1,
          numOfPages: 0,
          batchLength: 0,
          totalNumComments: 0,
          datesLoaded:false,
          isSearchComponentShowing: false,
          isListComponentShowing: true,
          searchedEmail: '',
          favoriteCommentExists: false,
      }
    },

    created() {

      this.loadComments();

    },

    mounted() {

      this.getTotalNumOfComments();

    },

    watch: {

      sortOrder: function () {

        return this.sortOrder;
      },
      currentPage: function () {

        if (this.currentPage < this.numOfPages) {

          this.isLastPage = false;
        }

        if (this.currentPage <= 1) {

          this.isFirstPage = true;
        } else {

          this.isFirstPage = false;
        }
      }
    },

    computed: {
      betweenDates: function () {

             return this.getBetweenDates();
      },
    },

    methods: {

      setSearchedEmail({ email }) {


          this.searchedEmail = email;

      },

      toggleSearchComponent({view}) {

        if (view === 'search') {

          this.isSearchComponentShowing = true;

          this.isListComponentShowing = false;
        }
      },

      toggleListComponent({view}) {

        if (view === 'list') {

         this.isListComponentShowing = true;

         this.isSearchComponentShowing = false;
        }
      },

      getBetweenDates() {

        if (this.datesLoaded) {

          const firstDate = this.firstCommentOnPage.formattedDate
          .slice(0, this.firstCommentOnPage.formattedDate.length - 5);

          const lastDate = this.lastCommentOnPage.formattedDate
          .slice(0, this.lastCommentOnPage.formattedDate.length - 5);

          return `${firstDate} - ${lastDate}`;
        }
      },


     loadComments() {

       this.db.collection('reviews')
       .orderBy('createdAt', 'desc')
       .limit(this.commentsPerPage)
       .get()
       .then(
         (querySnapshot) => {
            this.batchLength = querySnapshot.docs.length;

            this.lastCommentOnPage = this.formatCreatedAtDate(querySnapshot.docs[querySnapshot.docs.length -1]);

            this.firstCommentOnPage = this.formatCreatedAtDate(querySnapshot.docs[0]);

             this.pages.push(
              {
              page: 1,
              firstComment: this.firstCommentOnPage,
              lastComment: this.lastCommentOnPage,
              });
         querySnapshot.forEach(
           (doc) => {

           const comment = this.formatCreatedAtDate(doc);

          this.addEmailToComment(comment).then(() => {

            this.comments.push(comment);

            this.datesLoaded = true;

          })
         });
       })
     },

     formatCreatedAtDate(doc) {

       const comment = doc.data();

       const firebaseDate = comment.createdAt.toDate();

       const formattedDate = {

         month: firebaseDate.getMonth() + 1,

         year: firebaseDate.getFullYear(),

         day: firebaseDate.getDate()
       }

       const formattedDateString = `${formattedDate.month}/${formattedDate.day}/${formattedDate.year}`;

      comment.formattedDate = formattedDateString;

      return comment;
     },

     addEmailToComment(comment) {

      return this.db.collection('users')
       .where('userId', '==', comment.userId)
       .get()
       .then(
         (querySnapshot) => {

         querySnapshot.forEach(
           (doc) => {

           comment.email = doc.data().email;
         });
       });
     },

     handleDeleteComment(payload) {

        this.comments = this.comments.filter(
          (_comment) => {

          return _comment.id !== payload.commentId;
        });

       this.db.collection('users')
       .where('userId', '==', payload.commentUserId)
       .get()
       .then(
         (querySnapshot) => {

         querySnapshot.forEach(
           (doc) => {

           const userDocRef = this.db.collection('users').doc(doc.id);

           userDocRef.update(
             {
               reviews: firebase.firestore.FieldValue.arrayRemove(payload.restaurantId)
             }
           )
         })
       });

      this.db.collection('reviews')
      .where('id', '==', payload.commentId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {

          this.db.collection('reviews').doc(doc.id).delete();
        });
      })

      this.removeCommentFromFavorites(payload);
     },

       removeCommentFromFavorites(payload) {

      this.db.collection('favorites')
      .where('restaurantId', '==', payload.restaurantId)
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

           const commentToDelete = this.getCommentToDelete(reviews, payload.commentId);

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


     paginateComments(payload) {

       this.comments = [];

       this.datesLoaded = false;

        this.sortOrder = payload.sortOrder;



      const currentComment = this.pages.find(
           (comment) => {

                if (comment.page === this.currentPage) {

                  return comment;
                }
           });

        this.handlePageChanges();

        if (this.sortOrder === 'next') {

            this.db.collection('reviews')
            .orderBy('createdAt', 'desc')
            .startAfter(currentComment.lastComment.createdAt)
            .limit(this.commentsPerPage)
            .get()
            .then(
              (querySnapshot) => {

                this.recordNewPages(querySnapshot);

              querySnapshot.forEach(
                (doc) => {


                this.getFormattedComments(doc);


              });
            });
        } else if(this.sortOrder === 'prev') {

          this.db.collection('reviews')
          .orderBy('createdAt', 'desc')
          .endBefore(currentComment.firstComment.createdAt)
          .limitToLast(this.commentsPerPage)
          .get()
          .then(
            (querySnapshot) => {

                this.recordNewPages(querySnapshot);

            querySnapshot.forEach(
              (doc) => {

                this.getFormattedComments(doc);
            });
          });
        }
     },

     getFormattedComments(doc) {

        const comment = this.formatCreatedAtDate(doc);

        this.addEmailToComment(comment).then(

          () => {

        this.comments.push(comment);
        }).then(

          () => {
            if (this.comments.length === this.batchLength) {

                this.comments.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds);
            }

            this.datesLoaded = true;
        })
     },

     recordNewPages(snapshot) {

      this.batchLength = snapshot.docs.length;

      this.lastCommentOnPage = this.formatCreatedAtDate(snapshot.docs[snapshot.docs.length - 1]);

      this.firstCommentOnPage = this.formatCreatedAtDate(snapshot.docs[0]);

      const isMaxPageFound = this.pages.find(
        (page) => {
            return page.page === this.numOfPages;
      })

      const pageAlreadyExists = this.pages.find(

        (page) => {
        return page.page === this.currentPage;
    });

      if (isMaxPageFound === undefined && pageAlreadyExists === undefined) {

        this.pages.push(
          {
          page: this.currentPage,
          firstComment: this.firstCommentOnPage,
          lastComment: this.lastCommentOnPage,
          });
      }
     },

     handlePageChanges() {

      if (this.currentPage < this.numOfPages && this.sortOrder !== 'prev') {

        this.currentPage = this.currentPage + 1;
      }


      if (this.currentPage >= this.numOfPages) {

        this.isLastPage = true;
      } else {

        this.isLastPage = false;
      }

      if (this.currentPage > 1) {
        this.isFirstPage = false;
      } else {

        this.isFirstPage = true;
      }

      if (this.sortOrder === 'prev' && this.currentPage > 1) {

        this.currentPage = this.currentPage - 1;
      }


     },

     getTotalNumOfComments() {

       this.db.collection('reviews')
       .get()
       .then(
         (querySnapshot) => {

         this.totalNumComments = querySnapshot.docs.length;

         this.numOfPages = this.totalNumComments / this.commentsPerPage;

         if (!Number.isInteger(this.numOfPages)) {

           this.numOfPages = Math.floor(this.numOfPages) + 1;
         }
       });
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


/****TRANSITIONS****/
.slide-dates-enter-active, .slide-dates-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-dates-enter, .slide-dates-leave {
  transform: translate(-100px);
  opacity: 0;
}

.fade-link-enter-active, .fade-link-leave-active {
  transition: all 1s ease-in-out;

}

.fade-link-enter, .fade-link-leave {
  opacity: 0;
  transform:scale(0.4);
}
/****END TRANSITIONS****/

.comment-between-dates {
  display: flex;
  justify-content: center;
    img {
      margin-right: 0.5rem;
    }
  p {
    font-size: 1.2rem;
    font-weight: bold;
    font-style: italic;
    color: $black;
  }
}

.admin-comments-container {
  border: 1px solid $gray;
  width: 600px;
  margin: 0 auto;
  border-radius: 11px;
  background-color: $gray;
  position: relative;
}

.admin-page-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.change-view-link{
  display: flex;
  margin-right: 0.5rem;
  cursor: pointer;
}




.admin-search-comments-container {
  display: flex;
  justify-content: center;
  width: 600px;
  margin: 0 auto;
  flex-direction: column;
}




@media (max-width: 600px) {
  .admin-comments-container {
    width: 90%;
  }

  .admin-search-comments-container {
    width: 90%;
  }
}

</style>