<template>
  <transition name="fade-modal">
    <div v-if="isModalOpen" class="admin-comment-modal">
      <div class="admin-comment-inner-content">
        <p>Are you sure you would like to delete this comment?</p>
        <div class="modal-action-btns">
          <button @click="initModalActionConfim(
            {commentId: comment.id,
            restaurantId: comment.restaurantId,
            commentUserId: comment.userId,
            action: false,
            })" class="delete-modal-btn">Yes, I'm sure</button>
          <button @click="initModalActionCancel(false)" class="cancel-modal-btn">Cancel</button>
        </div>
      </div>
    </div>
  </transition>
</template>




<script>
export default {
  name: 'AdminCommentModal',
  props: {
    isModalOpen: Boolean,
    comment: Object,
  },

  data () {
    return {

    }
  },

  methods: {
    initModalActionCancel (action) {
      this.$emit('close',{
        action,
      });
    },

    initModalActionConfim (action) {
      this.$emit('confirm', {
        action
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
.fade-modal-enter-active, .fade-modal-leave-active {
  transition: all  .5s ease-in-out;

}

.fade-modal-enter, .fade-modal-leave-to {
  opacity: 0;
  transform: scale(1.2);
}


/****END TRANSITIONS****/

.admin-comment-modal {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  z-index: 7;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.admin-comment-inner-content {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  height: 70%;
  padding: 0.5rem;
}

.modal-action-btns {
  button {
    margin: 0 1rem;
    border-radius: 11px;
    padding: 0.3rem 0.4rem;
    border: none;
    width: 100px;
    transition: all 0.5s ease-in-out;
    color: $black;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }
  .delete-modal-btn {
    background-color: $blue;
    color: $offwhite;
  }

  .cancel-modal-btn {
    background-color: lighten($blue, 10);
    color: $offwhite;
  }
}




</style>