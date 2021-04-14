<template>
   <div class="flagged-overlay">

     <div class="flagged-overlay-header">
       <div
        @click="closeFlagModal(false)"
        class="close-flagged-overlay"
       >
       X
       </div>
        <h2>report comment</h2>
     </div>
     <div class="flagged-overlay-header-underline"></div>
     <div class="flagged-buttons">
       <button
       v-for="(button, index) in buttons" :key="index"
       @click="recordFlagReason(button.buttonText)"
       :style="button.style"
       >
       {{ button.buttonText }}
       </button>
     </div>
       <div class="important-warning-information">
         <img src="../assets/alert.svg" alt="alert" />
        <h3>If someone is in immediate danger, call local emergency services. Don't wait.</h3>
     </div>
     <div class="flagged-overlay-actions">
       <transition name="slide-flagged-overlay-button">
            <button v-if="flaggedReasons.length >= 1" @click="flagComment">Report</button>
       </transition>
     </div>
   </div>

</template>

<script>
import {firebase} from '@firebase/app';
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'FlagCommentModal',
  props: {
      review: Object,
      userId: String,
      alreadyFlagged: Boolean,
      currentUserName: String,
  },
  data() {
    return {

      db: firebase.firestore(),
      commentAuthorEmail: null,
      buttons: [
      {id: 0, buttonText: 'Violence', style: 'marginLeft: 25px'},
      {id: 1, buttonText: 'Harassment', style: 'marginRight: 25px'},
      {id: 2, buttonText: 'False News', style: 'marginLeft: 0px'},
      {id: 3, buttonText: 'Spam', style: 'marginRight: 0px'},
      {id: 4, buttonText: 'Terrorism', style: 'marginRight: 25px'},
      {id: 5, buttonText: 'Hate Speech', style: 'marginLeft:25px'},
    ],
      flaggedReasons: [],
    }
  },


  methods: {

    closeFlagModal(click) {

      this.$emit('closeFlag', {

        click,
      });
    },

    recordFlagReason(flagReason) {

      this.flaggedReasons.push(flagReason);

      this.buttons =  this.buttons.filter(

       (button) => {

           return button.buttonText !== flagReason ? button : ''
      });
    },



    addCommentToFlagged() {



        this.db.collection('flagged_comments')
        .add(
          {
            email: this.commentAuthorEmail,
            name: this.review.name,
            text: this.review.text,
            reviewId: this.review.id,
            flagger: this.currentUserName,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            markAsRead: false,
            flagReason: this.flaggedReasons.join(', '),
            restaurantId: this.review.restaurantId,
            id: uuidv4(),
            postedAt: this.review.createdAt,
            rating: this.review.rating,
            isArchived: false,
            userId: this.review.userId,
          }
        )
        .then(
          () => {
            this.closeFlagModal(false);
        });
      },


    flagComment() {

      if (!this.alreadyFlagged) {

      this.db.collection('users')
      .where('userId', '==', this.review.userId)
      .get()
      .then(
        (querySnapshot) => {

        querySnapshot.forEach(
          (doc) => {

            this.commentAuthorEmail = doc.data().email;

                this.addCommentToFlagged();
        });
      });
    }
    }
  }
}

</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;



//****TRANSITIONS****/
.slide-flagged-overlay-button-enter-active, .slide-flagged-overlay-button-enter-leave {
  transition: all 0.7s ease-in-out;
}

.slide-flagged-overlay-button-enter, .slide-flagged-overlay-button-leave-to {
  opacity: 0;
  transform:translateX(-200px);
}

//****END TRANSITIONS****/

.flagged-overlay {
  background-color: $black;
  position: absolute;
  height: 450px;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  box-shadow: 3px 3px 5px 0px rgba(50, 50, 50, 0.75);
}

 .flagged-overlay-header {
  color: #fff;
  margin: 0 auto;
  text-align: center;
}

.flagged-overlay-header-underline {
  height: 1px;
  background-color: darken($black, 5);
  width: 100%;
}

.flagged-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 3rem;

  button {
    justify-self: center;
    width: 120px;
    border: none;
    margin: 0.5rem 0;
    border-radius: 11px;
    padding: 0.3rem 0;
    background-color: gray;
    color: #fff;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: darken(gray, 10);
      transform: rotate(5deg);
    }
    &:hover:nth-child(even) {
      transform: rotate(-5deg);
    }

    &:nth-child(1) {
      margin-left: 0.5rem;
    }
  }
}

.close-flagged-overlay {
  font-size: 1.5rem;
  background-color: gray;
  width: 20px;
  text-align: right;
  margin: 5px 5px 0 auto;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  display: flex;
  justify-content: center;
  color: darken(gray, 15);
  font-weight: 900;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  &:hover {
    background-color: lighten(gray, 5);
    color: lighten(darkslategrey, 15);
  }
}

.flagged-overlay-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid darken($black, 5);
  align-items: center;
  height: 10%;

  button {
    margin-right: 0.5rem;
    border: none;
    background-color: lighten($blue,10);
    width: 100px;
    height: 30px;
    border-radius: 11px;
    color: #fff;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darken($blue, 10);
    }
  }
}


.important-warning-information {
  display: flex;
  width: 90%;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 2rem;
  color: gray;
  background-color: darken($black, 10);
  padding: 0.3rem 0.2rem;
  border-radius: 0.5rem;
  h3 {
    font-size: 1rem;
    padding: 0.3rem;
    margin: 0;
  }
}

</style>