<template>
  <div class="admin-archived-comments">
    <DashboardBackBtn />
    <div class="admin-archived-comments-container" ref="bottomOfComments">
      <header>
        <img src="../../assets/archive.svg" alt="a box" />
        <h1><span>({{ allArchivedCommentsNum }}) </span> Archived Comments</h1>
      </header>
      <AdminArchivedComment
        @deleteArchivedComment="handleArchivedCommentDelete"
        v-for="archivedComment in archivedComments"
        v-bind:key="archivedComment.id"
        :archivedComment="archivedComment"
        @flagged="moveCommentToFlagged"
     />
     <transition name="fade-load-more">
        <div v-if="isAtBottomOfComments" class="archived-comments-load-more-btn">
          <button v-if="archivedComments.length !== allArchivedCommentsNum"
            @click="loadMoreArchives">
            <i class="fas fa-spinner"></i>
             Load More...
         </button>
      </div>
     </transition>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';

import DashboardBackBtn from '../../components/DashBoardBackBtn';
import AdminArchivedComment from '../../components/AdminArchivedComment';

export default {
  name: 'AdminArchivedComments',
  components: {
    DashboardBackBtn,
    AdminArchivedComment,
  },
  props: {

  },

  data () {
    return {
      db: firebase.firestore(),
      archivedComments: [],
      archivedCommentsPerPage: 5,
      lastArchivedCommentOnPage: null,
      allArchivedCommentsNum: 0,
      isAtBottomOfComments: false,
      commentIDToRemove: '',
      commentIDToMove: '',
      indexer: 0,
      orderBy: {
        field: 'archivedAt',
        order: 'desc',
      }
    }
  },

  created() {

    this.getInitialArchivedComments();

    window.addEventListener('scroll', this.handleScroll);

  },

  mounted () {

    this.countArchivedComments();
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


    getInitialArchivedComments() {

      this.db.collection('archived_comments')
      .orderBy(this.orderBy.field, this.orderBy.order)
      .limit(this.archivedCommentsPerPage)
      .get()
      .then(
        (querySnapshot) => {

          this.lastArchivedCommentOnPage = querySnapshot.docs[querySnapshot.docs.length -1].data();

        querySnapshot.forEach((doc) => {

            let archivedComment = doc.data();

            this.createFormattedDate(archivedComment);

            this.assignIndexPosition(archivedComment);


            this.archivedComments.push(archivedComment);
        });
      })
    },

    assignIndexPosition (comment) {

        comment.index = this.indexer;

        this.indexer = this.indexer + 1;
    },

    createFormattedDate (archivedComment) {

        this.formatDate(archivedComment, archivedComment.postedAt, 'formattedPostedAt');

        this.formatDate(archivedComment, archivedComment.createdAt, 'formattedCreatedAt');

        this.formatDate(archivedComment, archivedComment.archivedAt, 'formattedArchivedAt');
    },

    countArchivedComments () {

      this.db.collection('archived_comments')
      .get()
      .then((querySnapshot) => {

        this.allArchivedCommentsNum = querySnapshot.docs.length;
      });
    },

    formatDate(comment, firebaseDate, newField) {

      const dateArr = firebaseDate
      .toDate()
      .toString()
      .split(' ');

     const date = [];

     dateArr.forEach(
       (dateSegment, index) => {

         if (index > 0 && index <= 3) {

           date.push(dateSegment);
         }
     });

     comment[newField] = date.join(', ');
    },

    loadMoreArchives () {

      this.db.collection('archived_comments')
      .orderBy(this.orderBy.field, this.orderBy.order)
      .limit(this.archivedCommentsPerPage)
      .startAfter(this.lastArchivedCommentOnPage.archivedAt)
      .get()
      .then(
        (querySnapshot) => {

            this.lastArchivedCommentOnPage = querySnapshot.docs[querySnapshot.docs.length -1].data();
        querySnapshot.forEach(
          (doc) => {

            let archivedComment = doc.data();

            this.assignIndexPosition(archivedComment);

            this.createFormattedDate(archivedComment);

            this.archivedComments.push(archivedComment);
        });
      })
    },

    removeArchivedComment(id) {

      this.commentIDToRemove = id;

      this.db.collection('archived_comments').where('id', '==', id)
        .get()
        .then(

          (querySnapshot) => {

           querySnapshot.forEach((doc) => {

             this.db.collection('archived_comments')
             .doc(doc.id)
             .delete()
             .then(
               () => {

               this.removeArchivedCommentFromUI(id);

               this.allArchivedComments = this.allArchivedComments - 1;

               this.allArchivedCommentsNum = this.allArchivedCommentsNum - 1;
             })
           });
      })
    },

    removeArchivedCommentFromUI(idToRemove) {

     this.archivedComments = this.archivedComments.filter((archivedComment) => {

              return archivedComment.id !== idToRemove ? archivedComment : '';
      });
    },

    moveCommentToFlagged ({ id }) {

      const commentData = this.findCommentToMove(id)

      const comment = this.removeIndexProp(commentData);

      this.addComment(comment).then(() => {

        this.removeArchivedComment(id);
      });
    },

    addComment(comment) {

      const commentToAdd = {

        formattedFlaggedDate: comment.formattedFlaggedDate,
        email: comment.email,
        name: comment.name,
        text: comment.text,
        reviewId: comment.reviewId,
        flagger: comment.flagger,
        createdAt: comment.createdAt,
        markAsRead: comment.markAsRead,
        flagReason: comment.flagReason,
        restaurantId: comment.restaurantId,
        id: comment.id,
        postedAt: comment.postedAt,
        rating: comment.rating,
        isArchived: comment.isArchived,
        userId: comment.userId,

      }

      return this.db.collection('archived_comments')
      .where('id', '==', comment.id)
      .get()
      .then(
        (querySnapshot) => {

          querySnapshot.forEach((doc) => {
            console.log(doc.data().id);
            this.db.collection('flagged_comments').add(commentToAdd);
            })

      })
    },

    findCommentToMove(idToFind) {

      return this.archivedComments.find(
        (comment) => {

        return comment.id === idToFind ? comment : '';
      });
    },

    removeIndexProp(commentToUpdate) {

      delete commentToUpdate.index;

      delete commentToUpdate.archivedAt;

      return commentToUpdate;

    },

    handleArchivedCommentDelete( {id} ) {

      this.removeArchivedComment(id);
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
.fade-load-more-enter-active, .fade-load-more-leave-active {
  transition: all 0.7s ease-in-out;
}

.fade-load-more-enter, .fade-load-more-leave-to {
  opacity: 0;
  transform: translateY(-300px);
}
//****END TRANSITIONS****/


.admin-archived-comments-container {
  width: 800px;
  margin: 3rem auto;
  overflow: hidden;
  position: relative;

  header {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $blue;
    border: 1px solid $gray;
    border-radius: 11px;
    img {
      margin-right: 1rem;
    }

    span {
      color: $black;
    }
  }
}

.archived-comments-load-more-btn {
  text-align: center;

  button {
    width: 170px;
    height: 35px;
    font-size:1rem;
    transition: all 0.5s ease-in-out;
    color: #fff;
    background-color: $red;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: darken($red, 10);
      border-radius: 11px;
    }
  }
}

@media (max-width: 826px) {
  .admin-archived-comments-container {
     width: 90%;
     margin: 3rem auto;
  }
}

</style>