<template>
  <transition name="fade-error" appear>
    <div class="add-restaurant-field-error">
      <p class="add-restaurant-error">{{ formFieldError }}</p>
    </div>
  </transition>
</template>




<script>

export default {
  name: 'AddRestaurantFieldError',

  props: {

    formFieldError: String,
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

/****TRANSITIONS****/
.fade-error-enter-active, .fade-error-leave-active {
  transition: all 0.7s;
}


.fade-error-enter, .fade-error-leave-to {
  opacity: 0;
}
/****END TRANSITIONS****/

.add-restaurant-field-error {

  text-align: center;

  p {
    color: $red;
  }
}

</style>