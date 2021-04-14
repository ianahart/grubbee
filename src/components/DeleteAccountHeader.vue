<template>
  <div class="delete-account-header">
    <h1>Delete Account</h1>
    <p>Hi Bill</p>
    <p>We're sorry to hear you'd like to delete your account.</p>
    <h3>Keeping Your Data Safe</h3>
    <p>Nothing is more important to us than the safety and security of the Grubbee community. People put there trust in us by sharing their information. So we will never make any compromises when it comes to safeguarding your data.</p>
    <div class="delete-account-divider"></div>

  </div>
</template>


<script>

// This is a permit action that cannot be undone once you delete your account you can not get it back
// Please type the following [ name/email       ] so that we can confirm you understand this use of action

  export default {

    name: 'DeleteAccountHeader',

    props: {

    },

    components: {

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
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;


.delete-account-header {


  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 900;
    color: lighten($blue, 6);
  }

  p {
    line-height: 1.6;
  }
}

.delete-account-divider {
  height: 2px;
  background-color: lighten($blue, 20);
  width: 100%;
}
</style>