<template>
  <div class="admin-user-list-header">
    <header>
      <h1><img src="../assets/user.svg" alt="" />Grubbee Users</h1>
    </header>
    <p>Browse or look up users to acquire their account details and activity.</p>
  </div>
</template>





<script>

  export default {

    name: 'AdminUserListHeader',

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
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

.admin-user-list-header {

  // background-color: darken($gray, 1);
  padding: 1rem 0;

  header {
    display: flex;
    justify-content: center;
    align-content: center;

   h1 {
     display: flex;
     justify-content: center;
     font-weight: 100;

     img {
       height: 35px;
       margin-right: 0.5rem;
     }
   }
  }

  p {
    text-align: center;
    padding-bottom: 1rem;
    margin-bottom: 0;
    color: lighten(darkslategray, 10);
  }
}

@media(max-width: 600px) {

  .admin-user-list-header {

    padding: 0.3rem 1rem;
  }

}

</style>