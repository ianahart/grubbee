<template>
  <div>
    <div class="restaurant-name">
      <h3>{{ restaurant.name }}</h3>
    </div>
    <div class="avg-rating">
      <h3><i class="fas fa-star star"></i> {{ restaurant.avg_rating }} rating</h3>
      <FavoriteBtn
      :restaurants="restaurants"
      v-if="currentUserId && !currentUser.isAdmin"
      :restaurant="restaurant"
      />
    </div>
    <div class="restaurant-content">
    <div class="restaurant-img">
      <img v-bind:src="restaurant.image_url" />
    </div>
    <div class="address-container">
      <h4><i class="fas fa-map-marker"></i> {{ restaurant.address }}</h4>
      <h4><i class="fas fa-city"></i> {{ restaurant.city }}</h4>
      <h4 class="zip-code"><img src="../assets/zip.png" />{{ restaurant.zip_code }}</h4>
    </div>
    </div>
  </div>
</template>
<script>
import FavoriteBtn from './FavoriteBtn';
export default {
  name: 'Restaurant',
  components: {
    FavoriteBtn
  },
  props: {
    restaurants: Array,
    restaurant: Object,
    currentUserId: String,
    currentUser: Object,
  },
  data () {
    return {

    }
  },

  methods: {

  }
}
</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

.restaurant-name {
  h3 {
    background-color: $red;
    color: $offwhite;
    margin: 0;
    text-align: center;
    padding: 0.5rem;
  }
}

.avg-rating {
  display: flex;
  flex-direction: column;
  h3 {
    margin-bottom: 0.1rem;
    margin-top: 0.3rem;
    margin-left: 0.5rem;
  }
  .star {
    color: orange;
  }
}

.restaurant-content {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

  .zip-code {
    display: flex;

    align-items: center;
  }

.restaurant-img {
  img {
    width: 200px;
  }
}

.address-container i {
  color: $red;
}

.address-container {
  h4 {
    font-weight: bold;
  }
}

@media (max-width: 600px) {
    .restaurant-img {
  img {
    width: 150px;
  }
}

.restaurant-content {
  flex-direction: column;
  align-items: center;
}
}

</style>