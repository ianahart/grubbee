<template>
  <transition name="fade-refund-modal">
    <div
      v-if="isModalOpen"
      class="stripe-refund-modal"
      >
      <div class="stripe-refund-inner-modal">
        <div class="refund-information-modal">
          <p>{{ firstName }}, are you sure you want to be refunded?</p>
          <p>Your restaurant will be removed immediately and you will be refunded the signup fee</p>
        </div>
        <div class="refund-button-modals">
          <button
            @click="sendModalEvent('accept')"
            class="accept-refund-btn"
            >
            Refund me
          </button>
          <button
          @click="sendModalEvent('deny')"
          class="deny-refund-btn"
          >
          Cancel
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>




<script>
  export default {

    name: 'StripeRefundModal',

    components: {

    },

    props: {
      firstName: String,
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
      sendModalEvent(action) {

        this.$emit('modalaction', {

            action,
         }
        );
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
.fade-refund-modal-enter-active, .fade-refund-modal-leave-active {
  transition: opacity .75s;
}
.fade-refund-modal-enter, .fade-refund-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
//****END TRANSITIONS****/

.stripe-refund-inner-modal {
  padding: 1rem;
}

.stripe-refund-modal {
  border-radius: 7px;
  height: 300px;
  width: 50%;
  background-color: rgba(0,0,0,0.5);
  margin-left: 2rem;
  max-width: 500px;
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0);

}

.refund-information-modal {
    p {
      color: $gray;
      &:first-of-type {
        font-size: 1.15rem;
      }
    }
  text-align: center;
}

.refund-button-modals {
  margin-top: 4rem;
  display: flex;
  justify-content: space-evenly;

  button {

    width: 120px;
    height:40px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    color: $gray;
    transition: all 0.5s ease-in-out;
    &:hover {
      opacity: 0.6;
    }
  }
}

.accept-refund-btn {

  background-color: lighten($lightBlue, 5);
}

.deny-refund-btn {
  background-color: lighten($blue, 5);
}

@media (max-width: 600px) {

  .stripe-refund-modal {
    margin: 0 auto;
    width: 90%;
    height: 300px;
  }
}

</style>