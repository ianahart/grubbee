<template>
  <div class="edit-restaurant-header">
    <header>
      <h1>Your Restaurant</h1>
      <p>Keep your restaurant information up-to-date</p>
      <img src="../assets/edit-restaurant.png" alt="arrows representing a change logo" />
    </header>
    <div class="edit-restaurant-header-underline"></div>
  </div>
</template>


<script>

export default {

  name: 'EditRestaurantHeader',

  components: {

  },

  props: {

  },

  data () {

    return {

    }
  },

  methods: {

  },
};



</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

.edit-restaurant-header {
  height: 300px;
  width: 100%;

}

.edit-restaurant-header header {
  height: 100%;
  background: rgb(33,141,195);
  background: linear-gradient(90deg, rgba(33,141,195,1) 0%, rgba(69,174,191,1) 35%, rgba(61,90,128,1) 100%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  width: 100%;

  h1 {
    margin: 0;
    margin-bottom: 0.5rem;
    color: lighten($black, 5);
  }

  p {
    color: darken($gray, 10);
  }

  img {
    width: 100px;
  }
}

.edit-restaurant-header-underline {
  width: 100%;
  height: 3px;
  background-color:lighten($red, 5);
}
</style>