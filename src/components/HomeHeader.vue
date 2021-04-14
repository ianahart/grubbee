<template>
  <div class="home-header">
    <header>
      <h1>Grubbee</h1>
      <h2>America's #1 Rated Restaurant Discovery Platform</h2>
      <HomeActionLinks />
    </header>
  </div>
</template>

<script>

import HomeActionLinks from './HomeActionLinks.vue';

  export default {

    name: 'HomeHeader',

    props: {

    },

    components: {

      HomeActionLinks,

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

@import url('https://fonts.googleapis.com/css2?family=Akaya+Telivigala&display=swap');

.home-header {
  padding-top: 2rem;
  text-align: center;
}

.home-header header {
  display: flex;
  align-items: center;
  flex-direction: column;

  h1 {
    color: darken($blue, 5);
    font-weight: bold;
    font-family: 'Akaya Telivigala', cursive;
    font-size: 3rem;
  }

  h2 {
    background-color: rgba(224, 251, 252, 0.7);
    color: darken($blue, 5);
    padding: 0.2rem 0.5rem;
  }
}

</style>