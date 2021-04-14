<template>
  <div>
    <div class="single-favorite-card">
      <div class="banner-top-card"></div>
      <div class="card-columns">
        <div class="left-side-card">
          <h3>
            <span><i class="fas fa-star"></i> {{ favorite.avg_rating }}</span
            ><span>{{ favorite.name }}</span>
          </h3>
          <img :src="favorite.image_url" :alt="favorite.name" />
        </div>
        <div class="right-side-card">
          <p><i class="fas fa-map-marker"></i> {{ favorite.address }}</p>
          <p><i class="fas fa-city"></i> {{ favorite.city }}</p>
          <p class="zip-code-favorite">
            <img src="../assets/zip.png" /> {{ favorite.zip }}
          </p>
        </div>
      </div>
      <div class="bottom-card-row">
        <div>
            <p><i class="fas fa-phone"></i> {{ formattedPhone }}</p>
            <form @submit.prevent="sendDeleteAction(favorite.restaurantId)">
              <button class="unfavorite-card-btn">
                <i class="fas fa-heart-broken"></i> Unfavorite
            </button>
          </form>
        </div>
        <div class="add-read-reviews-container">
          <div>
            <router-link class="favorite-add-review-btn" v-if="!currentUser.isAdmin" :to="{path: '/addreview/' + favorite.restaurantId}"><i class="fas fa-pen"></i> Add a Review</router-link>
          </div>
            <div class="read-favorite-reviews">
          <router-link
            :to="{
              name: 'FavoriteRestaurantReviews',
              params: { id: favorite.restaurantId },
            }"
            >Read Reviews ({{ favorite.reviews.length }})</router-link
          >
        </div>
        </div>
      </div>
      <div class="menu-button">
        <button @click="geoCodeAndShowMenu"><i class="fas fa-map"></i> Menu</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Favorite',

  props: {
    favorite: Object,
    currentUser: Object,
  },

  data() {
    return {
      phoneNum: this.favorite.phone,
      lat: '',
      long: '',
      restaurantName: this.favorite.name,
    }
  },



  methods: {


      geoCodeAndShowMenu() {

        const geocodeBaseURL = 'http://api.positionstack.com/v1/';

        const geocodeEndpoint = 'forward';

        const geocodeQueryParams = `?access_key=${process.env.VUE_APP_POSITIONSTACK_API_KEY}&query=${this.favorite.address}, ${this.favorite.city}, ${this.favorite.zip}`;

        axios.get(geocodeBaseURL + geocodeEndpoint + geocodeQueryParams)
        .then(
          (response) => {

            this.lat = response.data.data[0].latitude;

            this.long = response.data.data[0].longitude;

        }).then(() => {

          this.$router.push(`/restaurantmenu?lat=${this.lat}&long=${this.long}&name=${this.favorite.name}`);
        });
      },

    sendDeleteAction(id) {
      this.$emit('delete', {
        id,
      });
    },
  },

  computed: {
    formattedPhone: function() {
      const areaCode = this.favorite.phone.slice(0, 3);

      const prefix = this.favorite.phone.slice(3, 6);

      const lineNumber = this.favorite.phone.slice(6);

      const formatted = `(${areaCode})-${prefix}-${lineNumber}`;

      return formatted;
    },
  },
};
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.single-favorite-card {
  background-image: url('../assets/restaurant.jpg');
  background-size: cover;
  background-position: center;
  border: 1px solid $gray;
  width: 90% !important;
  margin: 1rem auto;
  border-radius: 11px;
  color: $black;

}

.add-read-reviews-container {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}

.favorite-add-review-btn {
  width: 120px;
  display: block;
  padding: 0.3rem 0.2rem;
  transition: all 0.5s ease-in-out;
  text-decoration: none;
  font-size: 0.8rem;
  text-align: center;
  background-color: lighten($blue, 10);
  color: #fff;
  border-radius: 11px;
  margin-bottom: 1rem;
  cursor: pointer;
   &:hover {
    background-color: $blue;
  }
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

.banner-top-card {
  background-color: $red;
  height: 30px;
  width: 100%;
  border-radius: 11px;
  border-bottom-right-radius: 0rem;
  border-bottom-left-radius: 0rem;
}

.bottom-card-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  box-sizing: border-box;
  align-items: center;

  button {
    width: 120px;
    padding: 0.3rem 0.2rem;
    font-size: 0.8rem;
    border-radius: 11px;
    border: none;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darken($gray, 10);
    }
  }
  i {

    color: $red;
  }
}



.card-columns {
  display: flex;
  justify-content: space-between;
}

.left-side-card {
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

.left-side-card h3 span i {
  color: orange;
}

.right-side-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;

  p i {
    color: $red;
  }
}

.read-favorite-reviews {

  display: flex;
  justify-content: center;
  border-radius: 11px;
  background-color: $blue;
  width: 120px;
  padding: 0.3rem 0.2rem;
  transition: all 0.5s ease-in-out;
  &:hover {
    background-color: lighten($blue, 10);
  }
  a {
    color: $offwhite;
    font-size: 0.8rem;
    font-weight: bold;
    text-decoration: none;
  }
}

.zip-code-favorite {
  display: flex;
  align-items: center;
}

@media (max-width: 1300px) {
  .single-favorite-card {
    width: 90%;
  }
}

@media (max-width: 600px) {
  .single-favorite-card {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
