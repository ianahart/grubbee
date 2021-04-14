<template>
  <div class="change-password-header">
    <header>
      <img src="../assets/changepassword.svg" alt="lock and key" />
      <p>Changing your password frequently can increase security</p>
    </header>
  </div>
</template>




<script>


export default {

  name: 'ChangePasswordHeader',

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
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.change-password-header {
  header {
    height: 200px;
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1.3rem 0;
    margin: 1rem 0;
  }

  img {
    height: 175px;
  }

  p {
    text-align: center;
    color: $blue;
  }
}


@media (max-width: 600px) {
  .change-password-header {
  header {
    height: 130px;

  }

  img {
    height: 115px;
  }
}
}

</style>