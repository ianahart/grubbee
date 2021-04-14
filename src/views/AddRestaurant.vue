<template>
  <div class="add-restaurant-root">
    <div class="add-restaurant-container">
      <div class="add-restaurant-img-container">
          <img src="../assets/add-restaurant.jpg" alt="restaurant" />
        <div class="add-restaurant-overlay">
          <header>
            <div class="add-restaurant-img-bg">
              <img src="../assets/logo.png" alt="logo" />
            </div>
            <h1>Connect Your Restaurant To Grubbee</h1>

            <i class="fas fa-certificate add-restaurant-img-icon"></i>
            <div class="add-restaurant-price">
              <h2>One Time Payment</h2>
              <div class="add-restaurant-price-divider"></div>
              <h2>$10.99</h2>
            </div>
            <h2>Join Hundreds of Other Restaurants</h2>
          </header>
        </div>
      </div>
      <div class="add-restaurant-form-container">
        <AddRestaurantForm />
      </div>
    </div>
  </div>
</template>

<script>

import AddRestaurantForm from '../components/AddRestaurantForm.vue';

  export default {

    name: 'AddRestaurant',

    components: {

      AddRestaurantForm,
    },

    props: {

    },

    data () {

      return {

      }
    },

    created() {

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

.add-restaurant-img-icon {
  font-size: 3rem;
  color: $red;
}

.add-restaurant-root {
  height: 100%;
}

.add-restaurant-container {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

}

.add-restaurant-img-container {
  position: relative;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}

.add-restaurant-overlay {
  background-color: rgba(0,0,0,0.4);
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 60%;
    padding: 1rem;
  }

  h2 {

    text-align: center;
  }

  h1 {
    color: $offwhite;
    text-align: center;
  }

  h2 {
    color: $offwhite;
  }

  img {
    width: 150px;
    height: 150px;
  }
}

.add-restaurant-img-bg {
  position: relative;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-color: darken($black, 5);
  display: flex;
  justify-content: center;
  align-items: center;

}

.add-restaurant-price {
  h2 {
    text-align: center;
  }
    h2 {
      text-align: center;
      &:last-of-type {
        font-size:2rem;
        margin-top: 0.2rem;
        font-weight: bold;
        font-style: italic;
      }
    }


}

.add-restaurant-price-divider {
  width: 100%;
  height: 3px;
  background-color: $lightBlue;
}

@media (max-width: 860px) {
  .add-restaurant-container {

    grid-template-columns: 1fr;
  }

}



</style>
