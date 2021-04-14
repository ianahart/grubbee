<template>
  <transition name="fade-pdf-actions">
    <div v-if="totalSelectedPayments > 0" class="download-payments-pdf">
      <div class="button-payments-container">
        <button @click="sendDownloadRequest">Download</button>
        <button @click="closeBtnsPopup">Cancel</button>
      </div>
    </div>
 </transition>
</template>


<script>

export default {

  name: 'AdminPaymentsPDFButton',

  props: {

    totalSelectedPayments: Number,
  },

  components: {

  },

  data () {

    return {
      isPopUpOpen: false,
    }
  },

  created () {

  },

  mounted () {

  },

  methods: {
        closeBtnsPopup () {

          this.$emit('close',
            {

            }
          );
        },

        sendDownloadRequest () {

          this.$emit('download',
            {

           }
         );
        },
  },
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
.fade-pdf-actions-enter-active, .fade-pdf-actions-leave-active {
  transition: all 0.6s ease-in-out;
}
.fade-pdf-actions-enter, .fade-pdf-actions-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-25px);
}
//****END TRANSITIONS****/


.download-payments-pdf {
  background-color: $gray;
  box-shadow: 0px 10px 13px -7px #000000, 1px 2px 7px 2px rgba(0,0,0,0);
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-evenly;

  button {
    cursor: pointer;
    margin: 0 1rem;
    border: none;
    transition: all 0.5s ease-in-out;
    padding: 0.4rem 0.2rem;
    width: 100px;
    color: $gray;
    border-radius: 0.4rem;

    &:hover {
      opacity: 0.6;
    }

    &:first-of-type {

      background-color: $blue;
    }

    &:last-of-type {
      background-color: darken($gray, 5);
      color: $black;
    }
  }
}


</style>