<template>
  <div class="forgot-password-header">
    <header>
      <img src="../assets/forgotpassword.svg" alt="a keylock with question mark inside" />
      <p>Please enter the <span>email address for your account</span>. A verification code will be sent to you. Once you have recieved the verification code. You will be able to choose a new password for your account.</p>
    </header>
  </div>
</template>

<script>

  export default {

    name: 'ForgotPasswordHeader',

    components: {

    },

    props: {

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
// .fade-refund-modal-enter-active, .fade-refund-modal-leave-active {
//   transition: opacity .75s;
// }
// .fade-refund-modal-enter, .fade-refund-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
//****END TRANSITIONS****/

.forgot-password-header {
  width: 100%;
  background-color: #fff;
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    align-items: center;
    padding: 1.3rem 0;
    margin: 1rem auto;
    text-align: center;
    max-width: 800px;
  }

  img {

    height: 175px;
  }

  p {
    color: lighten($black, 5);
    line-height: 1.6;

    span {
      font-weight: bold;
      color: darken($black, 20);
    }
  }
}


</style>