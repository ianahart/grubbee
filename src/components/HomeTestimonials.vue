<template>
  <div  v-if="!testimonialsError" class="home-testimonials">
    <HomeTestimonial
      v-for="testimonial in testimonials" :key="testimonial.restaurantId"
      :testimonial="testimonial"
    />
  </div>
</template>

<script>
import axios from 'axios';

import HomeTestimonial from './HomeTestimonial.vue';

  export default {

    name: 'HomeTestimonials',

    props: {

    },

    components: {

      HomeTestimonial,
    },

    data () {

      return {
        isDataLoaded: false,
        testimonials: null,
        testimonialsError: false,
      }
    },

    created () {

    },

    async mounted () {

      await this.loadTestimonials();
    },

    methods: {

       async loadTestimonials () {


         try {

            let response;

            const url = process.env.VUE_APP_LOAD_TESTIMONIALS;

            const method = 'GET';

            response = await axios(
              {
                url,
                method,
                headers: {

                  'Accept' : 'application/json',
                  'Content-Type': 'application/json',
                }
              }
            );

            const { data } = response.data.body;

            this.testimonials = data;

         } catch (err) {

           if (err.response.status === 500) {

             this.testimonialsError = true;
           }
         }


       }

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

.home-testimonials {
  display: flex;
  justify-content: space-evenly;
  background-color: rgba(232, 216, 195, 0.5);
}

@media (max-width: 600px) {

  .home-testimonials {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

</style>