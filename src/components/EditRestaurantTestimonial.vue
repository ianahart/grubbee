<template>
  <div class="edit-restaurant-testimonial">
    <div class="testimonial-written" v-if="customerHasTestimonial">
      <h3><i class="fas fa-check-circle"></i>Grubbee Testimonial Written</h3>
    </div>
    <div v-if="!customerHasTestimonial" class="testimonial-new">
    <h1><i class="fas fa-scroll"></i> Would you like to leave Grubbee a testimonial?</h1>
    <p v-if="componentError">Testimonials are shut off for the time being, thank you</p>
    <button v-if="!isTestimonialOpen && !componentError" @click="openTestimonial(true)">Leave a Testimonial</button>
       <transition name="fade-testimonial">
        <div v-if="isTestimonialOpen" class="testimonial-container">
            <img @click="closeTestimonial(false)" src="../assets/x.svg" />
          <div class="testimonial-form">
            <p class="testimonial-meta">Your testimonial at some point may be featured on our platform</p>
            <p class="testimonial-error" v-if="testimonialError">{{ testimonialError }}</p>
            <div v-if="serverErrors !== null">
              <p v-for="(error, index) in serverErrors" :key="index" class="testimonial-server-error">{{ error }}</p>
            </div>
            <input @click="handleCheckbox" type="checkbox" />
            <label>I understand and allow Grubbee to use my testimonial</label>
            <textarea v-model="testimonialInput"></textarea>
            <button @click="handleSubmit">Submit</button>
          </div>
        </div>
      </transition>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { firebase } from '@firebase/app';

export default {

  name: 'EditRestaurantTestimonial',

  props: {
    currentUserId: String,
  },

  components: {

  },

  data () {

    return {

      isTestimonialOpen: false,
      testimonialInput: '',
      testimonialError: '',
      isChecked: false,
      customerHasTestimonial: false,
      serverErrors: null,
      componentError: '',
    }
  },

  created () {

  },

  async mounted () {


    await this.handleTestimonialAppearance();

  },

  methods: {

    async handleTestimonialAppearance () {

      try {

        const url = process.env.VUE_APP_SETUP_TESTIMONIAL;

        const method = 'POST';

        const requestData = {

          currentUserId: this.currentUserId,
        }

        const response = await this.sendFirebaseRequest(url, method, requestData);

        const { data } = response.data.body;


        if (data.hasTestimonial) {

          this.customerHasTestimonial = true;
        } else {

          this.customerHasTestimonial = false;
        }

      } catch (err) {

        console.log(err);
      }


    },

    handleCheckbox () {

      this.isChecked = !this.isChecked;
    },

    openTestimonial (open) {

      this.isTestimonialOpen = open;
    },

    closeTestimonial (close) {

      this.isTestimonialOpen = close;
    },

    async handleSubmit () {

      try {

        this.testimonialError = '';

        this.serverErrors = null;

        const url = process.env.VUE_APP_ADD_TESTIMONIAL;

        const method = 'POST';

        const requestData = {

          currentUserId: this.currentUserId,
          testimonialInput: this.testimonialInput,
        };


        this.validation();



        if (!this.testimonialError) {

          const response = await this.sendFirebaseRequest(url, method, requestData);

            if (response.status === 200) {

              this.customerHasTestimonial = true;
            }
        }



      } catch (err) {

        console.log(err.message);
      }
    },

    async sendFirebaseRequest (url, method, data) {

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);
  // console.log(firebase);

   // const idToken = 'eyJhbGciOiJSUzI1NiIsjVmMmZiNGY0MGYzY2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3J1YmJlZS02MTYxZSIsImF1ZCI6ImdydWJiZWUtNjE2MWUiLCJhdXRoX3RpbWUiOjE2MTgyNTMwNTEsInVzZXJfaWQiOiJ4M05rRTR2Y093WkdIOTU3WmptSnlzWHViR3kxIiwic3ViIjoieDNOa0U0dmNPd1pHSDk1N1pqbUp5c1h1Ykd5MSIsImlhdCI6MTYxODI1NDM1NiwiZXhwIjoxNjE4MjU3OTU2LCJlbWFpbCI6ImRvcmFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRvcmFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.ANiXahdAi_PG1LfiCFiMQ1wgbvXDbTTycV4M3s9XYLvfGjZQ9H4TwL6lUnlPSL6dWelKAzmgslB970crUNkXTwQg9QJmL6MiDBFWKStkdoQEPM9imwSWHWHiehr3CUPr0-YxwW_mwCngW_QpIu9KerOieiqdiJHS4_dgFkEjISshoaqtbTw8HsngYdWoy52EROt2WF7IZauYDaEhZF9VBu7kLrMmm5ygt9vkrT6hXo4TlT0gSsPRQPx3rce9AUEu1k0MGKfTUGtEkMntsIGzo-vM2zWS8OSYzuQ6WIGUS9B_CxNd9okzcvH9kY4aNFKFTUWJAy5z6D3ivudvl0-5Bg';

       let response;

       try {

          response = await axios(
            {
              url,
              method,
              headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
              },
              data,
            }
          );

          const fireBaseRes = response;

          return fireBaseRes;

       }  catch (err) {

          if (err.response.status === 400) {

            this.serverErrors = err.response.data.body.errors;
          }

          if (err.response.status === 404) {

            this.testimonialError = err.response.data.body.message;
          }

          if (err.response.status === 500) {

            this.componentError = err.response.data.body.error;
          }



       }
    },

    validation () {

      if (this.isChecked) {

        if (this.testimonialInput.trim().length === 0) {

            this.testimonialError = 'Please provide a testimonial';
          } else if (this.testimonialInput.split(' ').length < 5) {

            this.testimonialError = 'Please use at least five words'
          }
        } else {
          this.testimonialError = 'You have to check the box to submit your testimonial';
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


//****TRANSITIONS****/
.fade-testimonial-enter-active, .fade-testimonial-leave-active {
  transition: opacity .75s;
}
.fade-testimonial-enter, .fade-testimonial-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
//****END TRANSITIONS****/



.edit-restaurant-testimonial {
  background-color: whitesmoke;
  width: 95%;
  margin: 5rem auto;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  h1 {
    text-align: center;
    color: lighten($black, 10);
    font-weight: 100;
  }

  i {
    color: $lightBlue;
  }
  button {
    background-color: $lightBlue;
    border: none;
    color: $gray;
    height: 40px;
    border-radius: 7px;
    width: 150px;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: darken($lightBlue, 5);
    }
  }
}

.testimonial-meta {
      font-style: italic;
    color: $lightBlue;
}

.testimonial-container {
  text-align: right;
  img {
    background-color: lighten($black, 10);
    cursor: pointer;
    border-radius: 50%;

  }
}

.testimonial-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  textarea {
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    height: 120px;
    border: none;
  }
}

.testimonial-error,
.testimonial-server-error {
  color: $red;
}

.testimonial-form {

  label {
    color: lighten(darkslategray, 10);
    font-size: 0.9rem;
  }
}


.testimonial-written {
  h3 {
    color: $black;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  i {
    margin-right: 0.5rem;
    font-size: 2rem;
  }
}


@media (max-width: 600px) {
  .edit-restaurant-testimonial {
    width: 100%;

    h1 {
      font-size: 1.5rem;
    }

    p {
      text-align: center;
    }
  }
}


</style>