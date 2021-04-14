<template>
  <div>
    <transition name="modal-fade">
    <div class="delete-flagged-comment-modal" v-if="isModalOpen">
      <div class="deleted-flagged-modal-content">
        <div class="flagged-modal-close-btn">
          <img @click="exitModal(false)" src="../assets/x.svg" />
        </div>
        <div class="flagged-modal-question-container">
                <div class="flagged-modal-question">
                <h2>{{ name }}</h2>
                <div class="flagged-modal-underline"></div>
          <p>Are you sure you want to remove this comment written by <span>{{ author }}</span>?</p>
          <div class="flagged-modal-action-btns">
            <button @click="sendCommentToDelete(flaggedCommentID)" class="flagged-modal-action-delete"><i class="far fa-trash-alt"></i> Delete</button>
            <button @click="exitModal(false)" class="flagged-modal-action-cancel">Cancel</button>
        </div>
        </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>


<script>
export default {
  name: 'DeleteFlaggedCommentModal',
  props: {
    name: String,
    author: String,
    isModalOpen: Boolean,
    flaggedCommentID: String,
  },

  data () {
    return {

    }
  },

  methods: {

    sendCommentToDelete(id) {

      this.$emit('send', {
        id
      });
    },

    exitModal(close) {

      this.$emit('close', {
        close
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
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.7s ease-in-out;
}

.modal-fade-enter{
  opacity: 0;
  transform: translateX(-200px) translateY(-100px);
}

.modal-fade-leave-to  {
  opacity: 0;
  transform:  translateY(100px) translateX(200px);
}
//****END TRANSITIONS****/



.delete-flagged-comment-modal {
  background-color: rgba(0,0,0,0.8);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  color: #fff;
}


.flagged-modal-close-btn {
  display: flex;
  justify-content: flex-end;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  img {
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 0.2rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
  }
}

  .deleted-flagged-modal-content {
    height: 100%;
  }

.flagged-modal-question {
  background-color: lighten(black,15);
  margin: 0 auto;
  width: 90%;
  border-radius: 11px;
  height: 100%;
  box-shadow: 2px 4px 15px 0px #000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.5rem;
  text-align: center;
  h2 {
    margin-bottom: 0.5rem;
  }
  span {
    color: $lightBlue;
    font-weight: bold;
  }
}

.flagged-modal-underline {
  height: 3px;
  width: 50%;
  background-color: $lightBlue;
}

.flagged-modal-question-container {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 80%;
}

.flagged-modal-action-btns {
  margin: 0 auto;
  margin-top: 4rem;
  width: 50%;
  display: flex;
  justify-content: space-evenly;

  button {
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    width: 130px;
    border-radius: 11px;
    height:35px;
    border: none;
    font-size: 0.9rem;
    color: $offwhite;
    font-weight: bold;
    &:hover {
      opacity: 0.7;
    }
  }
}

.flagged-modal-action-delete {
  background-color: $red;

  i {
    font-size: 1.1rem;
  }
}

.flagged-modal-action-cancel {
  background-color: $blue;

}

@media (max-width: 600px) {
  .flagged-modal-action-btns {
    justify-content: space-between;
    width: 100%;
  }
}

</style>