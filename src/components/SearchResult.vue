<template>
   <transition name="fade-map">
  <div class="search-result">
     <div class="search-banner-top-card"></div>
      <div class="search-card-columns">
        <div class="left-side-search-card">
          <h3>
            <span><i class="fas fa-star"></i> {{ restaurant.avg_rating }}</span
            ><span>{{ restaurant.name }}</span>
          </h3>
          <FavoriteBtn
            v-if="!currentUser.isAdmin"
            :restaurant="restaurant"
            :currentUserId="currentUserId"
          />
          <div class="search-restaurant-image-container">
            <img :src="restaurant.image_url" :alt="restaurant.name" />
          </div>
        </div>
        <div class="right-side-search-card">
          <div class="search-location">
            <p><i class="fas fa-map-marker"></i> {{ restaurant.address }}</p>
            <p><i class="fas fa-city"></i> {{ restaurant.city }}</p>
            <p class="zip-code-search-restaurant">
              <img src="../assets/zip.png" /> {{ restaurant.zip_code }}
            </p>
          </div>
          <div class="search-write-review">
            <router-link v-if="!currentUser.isAdmin" :to="{path: '/addreview/' + restaurant.id}"><i class="fas fa-pen"></i> Add a Review</router-link>
          </div>
        </div>
      </div>
      <div v-if="isFetching === false">
        <Map
          :restaurant="restaurant"
          :coords="coords"
          :center="center"
          />
      </div>
  </div>
    </transition>
</template>


<script>
import axios from 'axios';
import FavoriteBtn from './FavoriteBtn';
import Map from './Map';

export default {
  name: 'SearchResult',
  components: {
    FavoriteBtn,
    Map
  },
  props: {
    restaurant: Object,
    currentUserId: String,
    currentUser: Object,
  },


  data() {
    return {
       coords: [],
      center:[],
      isFetching: true,
    }
  },

  created() {

        this.setCoordinates();


  },


  methods: {

      setCoordinates() {

      const options = {
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.restaurant.address} ${this.restaurant.state}.json`,
        method: 'GET',
        params: {
          access_token: process.env.VUE_APP_MAPBOX_API_KEY, country: 'US'

        }
      }

      axios.request(options).then(
        (response) => {

        options.url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.restaurant.city} ${this.restaurant.state} ${this.restaurant.zip_code}.json`;

        this.coords = response.data.features[0].center;

        return axios.request(options);
      }).then(
        (response) => {
        this.center = response.data.features[0].center;

        setTimeout(
          () => {
          this.isFetching =false;
        }, 1000);
      });
    },

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






.zip-code-search-restaurant {
  display: flex;
  align-items: center;
}

.search-result {
  justify-self: center;
  background-image: url('../assets/restaurant.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 50;
  max-width: 500px;
  border: 1px solid $gray;
  border-radius: 11px;

}

.menu-button {
  display: flex;
  justify-content: flex-start;

  padding: 0.5rem;

  button {
    width: 120px;
    border-radius: 11px;
    padding: 0.3rem 0.2rem;
    font-size: 0.8rem;
    border: none;
    cursor: pointer;
    background-color: $blue;
    color: $offwhite;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: lighten($blue, 10);
    }
  }
}


.search-banner-top-card {
  background-color: $blue;
  height: 30px;
  width: 100%;
  border-radius: 11px;
  border-bottom-right-radius: 0rem;
  border-bottom-left-radius: 0rem;
}



.single-favorite-card {
  border: 1px solid $gray;
  width: 600px;
  margin: 1rem auto;
  border-radius: 11px;
  color: $black;
}

.search-card-columns {
  display: flex;
  justify-content: space-between;

}



.left-side-search-card {
  padding: 0.5rem;



  button {
    border: none;
    padding: 0.3rem 0.5rem;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: darken($gray, 10);
    }
    i {
      color: $red;
    }
  }

  img {
    width: 150px;
  }
  h3 span:first-of-type {
    margin: 0 0.5rem;
  }

  p i {
    color: $red;
  }
}

.left-side-search-card h3 span i {
  color: orange;
}

.right-side-search-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
  p {
    margin: 0.2rem;
    text-align: left;
  }
  p i {
    color: $red;
  }
}

.search-location {
  margin-top: 3rem;
}

.search-write-review {
  margin-bottom: 1rem;
  a {
    background-color: darken(red, 5);
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    text-decoration: none;
    display: block;
    text-align: center;
    padding: 0.2rem 0.3rem;
    border-radius: 11px;
    color: #fff;
    &:hover {
      background-color: $red;
    }
  }
}

@media (max-width: 600px) {
  .search-result {
    width: 100%;
  }

  .search-card-columns {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
  }

  .search-restaurant-image-container {
    text-align: center;
  }

}

</style>