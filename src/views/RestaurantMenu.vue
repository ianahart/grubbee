<template>
  <div>
    <header class="menu-header">
      <h1>{{ name }} Menu</h1>
    </header>
    <div class="menu-items">
      <div class="cuisine">
        <span><i class="fas fa-utensils"></i></span>
        <span v-for="(cuisine, index) in cuisines" :key="index">{{ cuisine }}</span>
        <p>{{ restaurantHours }}</p>
      </div>
      <transition-group name="fade-menu-item" tag="div">
        <div ref="menuItem" class="menu-item" v-for="item in menuItems" :key="item.item_id">
          <MenuItem :item="item"/>
        </div>
      </transition-group>
      <div class="page-count">
        <p>Page {{ currentPage }} of {{ totalPages.length }}</p>
      </div>
      <div v-if="totalPages.length > 1" class="page-buttons">
        <div v-for="page in pagination" :key="page.id">
             <a @click="paginate(page.action)">{{ page.action }}</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import MenuItem from '../components/MenuItem';

export default {
  name: 'RestaurantMenu',
  components: {
    MenuItem,
  },
  data () {
    return {
      lat: '',
      long: '',
      name: '',
      restaurantId: '',
      pagination: [{id:23434324, action: 'Prev'}, {id: 345345435, action: 'Next'}],
      menuItems: [],
      cuisines: [],
      restaurantHours: '',
      currentPage: 1,
      totalPages: [],
    }

  },

  created() {

    this.lat = this.$route.query.lat;

    this.long = this.$route.query.long;

    this.name = this.$route.query.name;

    this.GetRestaurantMenu();

  },

  methods: {

      paginate(action) {

        if (action === 'Next') {

            if (this.currentPage < this.totalPages.length) {

              this.currentPage = this.currentPage + 1;
            }

        } else {

          if (this.currentPage > 1) {

            this.currentPage = this.currentPage - 1;
          }
        }
           this.GetRestaurantMenu()
      },



     GetRestaurantMenu() {

        const geoSearchOptions = {
            method: 'GET',
            url: 'https://us-restaurant-menus.p.rapidapi.com/restaurants/search/geo',
            params: {lon: this.long, lat: this.lat, distance: '1', page: '1'},
            headers: {
              'x-rapidapi-key': process.env.VUE_APP_RESTAURANT_MENU_API_KEY,
              'x-rapidapi-host': 'us-restaurant-menus.p.rapidapi.com'
            }
        };

       const restaurantMenuItemsOptions = {
           method: 'GET',
           url: `https://us-restaurant-menus.p.rapidapi.com/restaurant/[]/menuitems`,
           params: {page: this.currentPage},
           headers: {
            'x-rapidapi-key': '4bd951b448msh44aab5d57527a5dp1a87e4jsnbee1d0e415ca',
            'x-rapidapi-host': 'us-restaurant-menus.p.rapidapi.com'
        }
       }

        axios.request(geoSearchOptions).then((response) => {

         this.restaurantId =  response.data.result.data[0].restaurant_id

         restaurantMenuItemsOptions.url = restaurantMenuItemsOptions.url.replace('[]', this.restaurantId);

          return axios.request(restaurantMenuItemsOptions);

        })
        .then((response) => {

          this.totalPages = [];

          for(let page = 1; page <= response.data.result.pages; page++) {

            this.totalPages.push(page);

          }
          this.menuItems = [];

          response.data.result.data.forEach(
            (item, index) => {

            if (index <= 0) {

              this.restaurantHours = item.restaurant_hours;

              this.cuisines = [];

              item.cuisines.forEach((cuisine) => {

                this.cuisines.push(cuisine);
              });

            }

            this.menuItems.push(item);
          })
        });
    }
  }
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
.fade-menu-item-enter-active, .fade-menu-item-leave-active {
  transition: all 0.5s;
}

.fade-menu-item-enter, .fade-menu-item-leave-to {
  opacity: 0;
}

//****TRANSITIONS****/

.page-count {
  p {
    margin: 0.3rem 0.4rem;
    font-weight: bold;
  }
}

.page-buttons {
  display: flex;
  justify-content: center;
  margin: 1rem;
  a {
    margin: 0 0.5rem;
    color: $lightBlue;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      color: darken($lightBlue, 10);
      font-weight: bold;
    }
  }
}

.menu-price-underline {
  height: 2px;
  background-color: $lightBlue;
  width: 80%;
}

.menu-header {
  background-color: $lightBlue;
  padding:0.5rem;
  text-align: center;
  h1 {
    color: $blue;
    margin: 0;
  }
}

.cuisine {
  text-align: center;
  padding: 0.5rem;
  border-bottom: $gray 1px solid;
  span {
    font-style: italic;
    margin: 0 0.2rem;
  }
}

  .menu-items {
    width: 600px;
    margin: 0 auto;
    border: 1px solid $gray;
    margin-top: 5rem;
    border-radius: 0.25rem;
    margin-bottom: 2rem;
  }

  .menu-item {
    border: 1px solid $gray;
    padding: 0.5rem;
    height: 150px;

    p {
      font-style: italic;
      color: gray;
    }
  }

  .menu-item-price {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  justify-content: space-between;
  p {
    margin: 0 0.2rem;
    font-weight: 900;
    color: $black;
    margin-bottom: 0.4rem;
    span {
      font-weight: 900;
      color: $black;
    }
  }
}




  @media (max-width: 600px) {
    .menu-items {
     width: 90%;
     margin: 0 auto;
    }

    .menu-item-price {
      flex-direction: column;
      p {
        margin-top: 1rem;
        margin-bottom: 0;
      }
    }

    .menu-item {
      text-align: center;
    }
  }

</style>