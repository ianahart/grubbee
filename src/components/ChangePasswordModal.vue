<template>
  <transition name="fade-save-modal" appear>
    <div
      v-if="isModalOpen"
      class="change-password-modal"
    >
      <div class="change-password-modal-inner">
        <div class="colored-modal-divider"></div>
        <div class="change-password-modal-content">
          <div class="change-password-modal-info">
            <p>Are you sure you want to change your password?</p>
            <p>After changing your password, you will have to wait <span>24 hours (1 day) </span>to be able to change it again.</p>
          </div>
          <div class="change-password-modal-btns">
            <button @click="sendPasswordChange(false)">Yes, I'm sure</button>
            <button @click="cancelPasswordChange(false)">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>

  export default {

    name: 'ChangePasswordModal',

    components: {

    },

    props: {
      isModalOpen: Boolean,
    },

    data () {

      return {

      }
    },

    created () {

    },

    mounted () {

    },

    methods: {

      sendEvent(event, payload) {

        this.$emit(event,
          {
            payload,
          }
        );
      },

      sendPasswordChange (bool) {

        this.sendEvent('accept', bool);

      },

      cancelPasswordChange (bool) {

        this.sendEvent('deny', bool);
      },
    },
  }






</script>
<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$lightBlue: #45aebf;
$red: #ee6c4d;
$gray: #eee;

//****TRANSITIONS****/
.fade-save-modal-enter-active, .fade-save-modal-leave-active {
  transition: all .75s;
}
.fade-save-modal-enter, .fade-save-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-100px);
}
//****END TRANSITIONS****/

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

.change-password-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.change-password-modal-inner {
  background-color: #fff;
  border-radius: 7px;
  width: 50%;
}

.colored-modal-divider {
  height: 20px;
  background-color: $blue;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
}

.change-password-modal-content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}

.change-password-modal-info {
  text-align: center;

  p {

    span {

      color: $lightBlue;
    }

    &:first-of-type {
      color: lighten($black, 5);
    }

    &:last-of-type {
      color: $black;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
    }
  }
}

.change-password-modal-btns {
  margin: 2rem;

  button {
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    border-radius: 7px;
    width: 120px;
    height: 35px;
    margin: 0 0.7rem;
    border: none;

    &:hover {
      opacity: 0.7;
    }

    &:first-of-type {
      background-color: lighten($lightBlue, 10);
      color: #fff;
    }

    &:last-of-type {
      background-color: $gray;
      color: $black;
    }
  }
}

@media (max-width: 600px) {
  .change-password-modal-inner {
    width: 90%;
  }
}

</style>