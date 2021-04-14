<template>

 <div class="about-container">
   <transition name="slide-row-1" appear>
      <div class="about-row-1">
        <div class="about-column-1-top">
          <div class="statement-feature">
            <h2>our mission</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div class="about-column-1-bottom">
          <div class="statement-feature">
            <h2>our promise</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nam delectus fugit.</p>
          </div>
        </div>
    </div>
  </transition>
  <transition name="slide-row-2" appear>
    <div class="about-row-2">
      <div class="about-column-2-top">
        <div class="statement-feature">
          <h2>our essence</h2>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. A!</p>
        </div>
      </div>
      <div class="about-column-2-bottom">
        <div class="statement-feature">
          <h2>our vibe</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, omnis illo.</p>
        </div>
      </div>
    </div>
  </transition>
 </div>
</template>

<script>



export default {
  name: 'About',
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

@import url('https://fonts.googleapis.com/css2?family=Blinker&display=swap');

//****TRANSITIONS****/
.slide-row-1-enter-active, .slide-row-1-leave-active {
  transition: all .75s;
}
.slide-row-1-enter, .slide-row-1-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-75px);
}

.slide-row-2-enter-active, .slide-row-2-leave-active {
  transition: all .75s;
}
.slide-row-2-enter, .slide-row-2-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(75px);
}
//****END TRANSITIONS****/

.about-container {
 background: linear-gradient(to right, rgba(0,0,0,0.6),
              rgba(0,0,0,0.6)), url('../assets/about.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  color: #fff;
}

.about-row-1,
.about-row-2 {

  display: flex;
  flex-direction: column;
  width: 30%;

  h2 {
    text-transform: uppercase;
    font-family: 'Blinker', sans-serif;
  }

  p {
    line-height: 1.6;
  }
}

.about-column-1-top,
.about-column-2-top,
.about-column-1-bottom,
.about-column-2-bottom {
  text-align: center;
  width: 100%;
}

.statement-feature {
  background-color: rgba(0,0,0,0.2);
  padding: 0.5rem;
  margin: 3rem 0;
}

@media (max-width: 600px) {

  .about-container {
    flex-direction: column;
    align-items: center;
  }

  .about-row-1,
  .about-row-2 {

    width: 95%;
    margin: 0 auto;
  }
}


</style>