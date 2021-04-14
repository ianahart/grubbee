
<template>
  <div
    class="restaurant-payment-overlay-container"
    :style="{ 'background-image': 'url(' + require(`../assets/payment.jpg`) + ')' }"

  >
    <div v-if="componentLoaded" class="overlay-information">
      <transition name="fade-header" appear>
        <header v-if="componentLoaded">
          <h1>{{ title }}</h1>
          <div class="header-underline"></div>
        </header>
      </transition>
      <transition name="slide-overlay-content" appear>
      <div>
        <div class="overlay-information-row1">
          <div class="overlay-information-box">
            <i class="fab fa-connectdevelop dark-icon"></i>
            <h3>Connections</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi dolorem architecto dignissimos repudiandae quis quibusdam sint minima numquam voluptas velit, eos dolores dolorum a, atque excepturi eligendi et nemo possimus.</p>
          </div>
          <div class="overlay-information-box">
            <i class="fas fa-chart-line dark-icon"></i>
            <h3>See Results</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi dolorem architecto dignissimos repudiandae quis quibusdam sint minima numquam voluptas velit, eos dolores dolorum a, atque excepturi eligendi et nemo possimus.</p>
          </div>
        </div>
        <div class="overlay-information-row2">
          <div class="overlay-information-box">
            <i class="fas fa-shield-alt"></i>
            <h3>Secure</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore non quasi inventore ratione, corrupti necessitatibus temporibus reprehenderit unde cum quod!</p>
          </div>
        </div>
      </div>
    </transition>
    </div>
  </div>
</template>


<script>

export default {

  name: 'RestaurantPaymentOverlay',

  components: {

  },

  props: {

    title: String,
    overlayImage: String,
    overlayImageExt: String,
  },

  data () {

    return {

      componentLoaded: false,
    }
  },

  created () {

  },

  mounted () {

    this.componentLoaded = true;
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

//****TRANSITIONS****/
.fade-header-enter-active, .fade-header-leave-active {
  transition: all 0.75s;
}


.fade-header-enter, .fade-header-leave-to {
  opacity: 0;
  transform:translateX(-200px);
}


.slide-overlay-content-enter-active, .slide-overlay-content-leave-active {
  transition: all 0.75s;
}


.slide-overlay-content-enter, .slide-overlay-content-leave-to {
  opacity: 0;
  transform:translateY(200px);
}

//****END TRANSITIONS****/

.header-underline {
  width: 35%;
  margin-top: 0.5rem;
  background-color: $lightBlue;
  height: 3px;
}

.restaurant-payment-overlay-container {
  position: relative;
  height: 750px;
  background-size: cover;
  background-position: center;
}

.overlay-information {
  display: block;
  header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
  h1 {
    margin: 0;
  }
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: $offwhite;

  background-color: rgba(0, 0, 0, 0.7);
}

.overlay-information-row1 {
  display: flex;
  justify-content: space-evenly;
  box-sizing: border-box;


}

.overlay-information-row2 {
  display: flex;
  justify-content: center;
  margin-top: 2rem;

}

.overlay-information-box {
   width: 30%;
   height: 100%;
   box-sizing: border-box;
   text-align: center;

   p {
     line-height: 1.6;
   }

   h3 {
     text-align: center;
   }

  .dark-icon {
    color: lighten($blue, 10);
  }

   i {
     display: block;
     color: darken($lightBlue, 10);
     font-size: 2.5rem;
   }
}

@media(max-width:787px) {
  .overlay-information-row2 {
    margin-top: 0;
  }

  .overlay-information-box {
    width: 90%;
    margin: 0 auto;
    text-align: center;
  }

  .overlay-information-row1 {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // height: 50%;
  }

  .restaurant-payment-overlay-container {
    height: 875px;
  }

  .header-underline {
    width: 70%;
  }

  .overlay-information {
    header {
      width: 100%;
      margin: 1.5rem auto;
      h1 {
      font-size: 1.5rem;
      }
  }
  }
}

</style>