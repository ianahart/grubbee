<template>
  <div class="home-offers">
    <HomeOffer
      v-for="(offer , index) in offers" :key="index"
      :text="offer.text"
      :file="offer.file"
    />
  </div>
</template>

<script>

import HomeOffer from './HomeOffer.vue';

  export default {

    name: 'HomeOffers',

    props: {

    },

    components: {

      HomeOffer,
    },

    data () {

      return {
        offers: [
          {file: 'offer-heart', text: 'Loved & trusted by over a hundred customers'},
          {file: 'offer-circle', text: 'Not impressed with results? We offer a 7-day guarantee money back'},
          {file: 'offer-award', text: 'Multiple awards in various food services'},
          {file: 'offer-dollar', text: 'Great results for a competitive price'},
        ],
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


.home-offers {
  margin-top: 12rem;
  display: flex;
  justify-content: center;
  background-color: rgba(61, 90, 128, 0.5);
  padding: 0.3rem 1rem;
  text-align: center;
}

@media (max-width: 600px) {
  .home-offers {
  flex-direction: column;
  }

}

</style>