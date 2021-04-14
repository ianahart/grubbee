<template>
  <transition name="fade-modal">
    <div v-if="isModalOpen" class="admin-archived-comment-modal">
        <div @click="sendClose(false)" class="archived-comment-modal-btn">
          <i class="fas fa-times"></i>
        </div>
        <div class="archived-comment-inner-content">
          <p>Are you sure you want to delete this comment written by:</p>
          <p><span>{{ email }}</span> from the archives?</p>
        </div>
        <div class="archived-comment-modal-btns">
          <button @click="sendDelete(commentID)" class="archived-comment-delete"><i class="far fa-trash-alt"></i> Yes, I'm sure</button>
          <button @click="sendClose(false)" class="archived-comment-cancel">Cancel</button>
        </div>
    </div>
  </transition>
</template>


<script>
  export default {

    name: 'AdminArchivedCommentModal',

    components: {

    },

    props: {

      isModalOpen: Boolean,
      email: String,
      commentID: String,
    },

    data() {

      return {

      }
    },

    methods: {
      sendClose(action) {

        this.$emit('modalAction', {

          action,
        });
      },

      sendDelete(id) {

        this.$emit('delete', {

           id,
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
.fade-modal-enter-active, .fade-modal-leave-active {
  transition: all .75s ease-in-out;

}

.fade-modal-enter, .fade-modal-leave-to {
  opacity: 0;


}
//****END TRANSITIONS****/

.archived-comment-modal-btns {
  display: flex;
  justify-content: space-around;

  button {
    width: 120px;
    border: none;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
    height:30px;
    font-size: 0.9rem;
  }
}

.archived-comment-delete {
    background-color: $red;
    color: $offwhite;
    transition: all 0.6s ease-in-out;

    &:hover {
      background-color: darken($red,10);
      border-radius: 11px;
    }
}

.archived-comment-cancel  {
  background-color: $gray;
  color: $black;
  transition: all 0.6s ease-in-out;

  &:hover {
    background-color: darken($gray, 10);
    border-radius: 11px;
  }
}

.admin-archived-comment-modal {
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 1;
  background-color: rgba(0,0,0,0.8);
  border-radius: 11px;
}

.archived-comment-modal-btn {
  display: flex;
  justify-content: flex-end;
  margin-right: 1rem;
  margin-top: 1rem;

  i {
    color: #fff;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 1.75rem;
    background-color: $lightBlue;
    padding: 0.2rem 0.5rem;
    border-radius: 50%;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darken($lightBlue, 15);
      color: darken(#fff, 15);
    }
  }
}

.archived-comment-inner-content {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height:50%;

  span {
    font-style: italic;
    font-weight: 900;
    color: $lightBlue;
  }

  p {
    color: $offwhite;
  }
}

</style>