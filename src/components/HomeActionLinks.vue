<template>
   <div class="home-action-btns">
    <router-link class="action-btn-register" :to="{name: 'Register'}"><i class="far fa-user"></i> Register Now</router-link>
    <router-link class="action-btn-explore" :to="{name: 'Restaurants'}"><i class="fas fa-search"></i> Explore</router-link>
   </div>
</template>

<script>
  export default {

    name: 'HomeActionLinks',

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

.home-action-btns {
  margin-top: 3rem;

  a {
    color: $gray;
    display: inline-block;
    margin: 0 1rem;
    text-decoration: none;
    padding: 0.5rem 0.5rem;
    cursor: pointer;
    width: 120px;
    text-align: center;
    border-radius: 0.25rem;
    transition: all 0.5s ease-in-out;
    &:hover {
      opacity: 0.85;
    }
  }
}

.action-btn-register {
  background-color: $blue;
}

.action-btn-explore {
  background-color: lighten($blue, 10);
}

@media (max-width: 600px) {

  .home-action-btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;

    a {
      margin: 1rem 0;
    }
  }
}

</style>