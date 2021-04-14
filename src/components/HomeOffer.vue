<template>
  <div class="home-offer">
    <img :src="require(`../assets/${file}.svg`)" alt="bar chart"/>
    <p class="offer-text">{{ text }}</p>
  </div>
</template>

<script>
  export default {

    name: 'HomeOffer',

    props: {
      text: String,
      file: String,
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

.home-offer {
  margin: 0 1rem;
  text-align: center;
  padding: 0.5rem 0;
}

.offer-text {
  color: $gray;
  line-height: 1.6;
}

</style>