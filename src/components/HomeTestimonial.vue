<template>
  <div class="home-testimonial">
    <p class="testimonial-restaurant-name">{{ testimonial.restaurant_name }}</p>
    <p class="testimonial-text"><em>&#34;{{ testimonial.testimonial }}&#34;</em></p>
    <p class="testimonial-author">-{{ testimonial.restaurant_owner_name }}</p>
  </div>
</template>

<script>
  export default {

    name: 'HomeTestimonial',

    props: {
      testimonial: Object,
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

.home-testimonial {
  padding: 1.5rem 1rem;

  &:nth-of-type(even) {
    background-color: rgba(232, 216, 195, 0.6)
  }
}

.testimonial-restaurant-name {
  text-align: center;
}

.testimonial-text {
  line-height: 1.6;
}

.testimonial-author {
  text-align: right;
  font-weight: 900;
  color: darken($black, 10);
}


</style>