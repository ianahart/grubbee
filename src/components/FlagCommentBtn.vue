<template>
  <div
    @mouseover="showToolTip"
    @mouseleave="hideToolTip"
    class="tool-tip"
    v-if="userId !== review.userId">
      <p v-if="isToolTipShowing && !alreadyFlagged">Flag Comment</p>
      <p class="tool-tip-feedback" v-if="alreadyFlagged">Already Flagged</p>
      <div>
      <span>
        <!-- alreadyFlagged second parameter -->
        <i @click="showFlaggedModal(true)" class="far fa-flag"></i>
      </span>
      </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';

  export default {
    name:'FlagCommentBtn',
    props: {
      review: Object,
      userId: String,
      alreadyFlagged: Boolean,
    },
    data () {
      return {

      isToolTipShowing: false,
      db:               firebase.firestore(),
      currentUserName: null,
      commentAuthorEmail: null,

      }
    },

    methods: {

          showFlaggedModal(click) {

              if (this.alreadyFlagged === false) {

                  this.$emit('openFlag', {
                  click,
                })
              }
          },

         showToolTip() {

           if (this.isToolTipShowing) {

             return;
           } else {

               this.isToolTipShowing = true;
           }

        },

        hideToolTip() {

          if (!this.isToolTipShowing) {

            return;
          } else {

            this.isToolTipShowing = false;
          }
        },

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

.tool-tip{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .tool-tip-feedback {
    color: $red;
  }
  p {
    margin: 0;
    font-size: 0.75rem;
    background-color: $gray;
    color: $blue;
    padding: 0.2rem 0.3rem;
    margin-bottom: 0.2rem;
    position: relative;

  &:after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 70%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: $gray transparent transparent transparent;
    }
  }
  span {
    display: block;
    color: $gray;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    &:hover {
      color: orange;
    }
  }
}
</style>