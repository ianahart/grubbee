<template>
   <div class="review-rating-select">
      <h3>What did you think?</h3>
      <i
      @mouseover=" !starCountSet && highlight(rating)"
      @mouseleave=" !starCountSet && unhighlight"
      @click="set(tempValue)"
      :disabled="true"
      v-bind:class=" tempValue >= rating  ? 'selected' : 'not-selected' "
      class="fas fa-star"
      v-for="rating in ratings" v-bind:key="rating"></i>

  </div>
</template>

<script>
  export default {
    name: 'StarRating',
    props: {
      ratings: Array,
    },
    data () {
      return {
        starCount: 0,
        tempValue: 0,
        starCountSet: false,

      }
    },
    methods: {
      highlight(rating) {

        this.tempValue = rating;

      },

      unhighlight() {
        this.tempValue = 0;
      },

      set (value) {

        this.starCount = value;

        this.starCountSet = true;

        this.$emit('starRating', this.starCount);
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

.review-rating-select {
  margin-left: 2rem;

  h3 {
    color: $blue;
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  i {
    cursor: pointer;
    color: $gray;
  }

  .selected {
    color: orange;
    transition: all 0.2s ease-in-out;
 }

 .not-selected {
   color: $gray;
 }
}




</style>