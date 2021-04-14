<template>
  <div class="navbar">
    <nav>
      <div class="hamburger-container">
        <li>
          <router-link :to="{ name: 'Home' }"
            ><img src="../assets/logo.png"
          /></router-link>
        </li>
        <div @click="toggleMenu" class="hamburger-menu">
          <div class="line-1"></div>
          <div class="line-2"></div>
          <div class="line-3"></div>
        </div>
      </div>
      <div @click="closeMenuOnClickLink($event)" v-bind:class="menuObject">
        <div class="menu-heading">
          <h3 v-if="userName">Welcome, {{ userName }}</h3>
          <h3 v-if="isLoggedIn && adminLoggedIn">Welcome, Admin</h3>
        </div>
        <ul>
          <div class="secondary-links-container">
            <li @click="toggleLinks" @mouseover="showLinks">
              Explore <i class="fas fa-sort-down sort-icon"></i>
            </li>
            <div v-bind:class="linksObject" @mouseleave="hideLinks">
              <li v-if="isLoggedIn">
                <router-link :to="{ name: 'Search' }">Search</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'Restaurants' }"
                  >Restaurants</router-link
                >
              </li>
              <li v-if="isLoggedIn && !adminLoggedIn">
                <router-link :to="{ name: 'AddReview' }"
                  >Add a Review</router-link
                >
              </li>
              <li v-if="isLoggedIn && !adminLoggedIn">
                <router-link :to="{ name: 'AddRestaurant' }"
                  >Add A Restauarant</router-link
                >
              </li>
              <li v-if="isLoggedIn && !adminLoggedIn && userHasRestaurant">
                <router-link :to="{ name: 'EditRestaurant' }"
                  >Edit Restauarant</router-link
                >
              </li>
            </div>
          </div>
          <div class="main-links">
            <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
            <li v-if="!isLoggedIn">
              <router-link :to="{ name: 'Register' }">Register</router-link>
            </li>
            <li v-if="!isLoggedIn">
              <router-link :to="{ name: 'Login' }">Login</router-link>
            </li>
            <li><router-link :to="{ name: 'About' }">About</router-link></li>
            <li v-if="isLoggedIn && !adminLoggedIn">
              <p class="logout" @click="logoutUser">Logout</p>
            </li>
          </div>
        </ul>

        <div v-if="isLoggedIn && !adminLoggedIn" class="settings-panel-link">
          <ul>
            <li
              @mouseover="showSettings"
              @click="toggleSettings"
            >
                Settings <i class="fas fa-sort-down sort-icon"></i>
            </li>
            <transition name="fade-settings">
              <ul
                @mouseleave="hideSettings"
                v-if="settingsLinkVisible"
                class="delete-account-link-list"
              >
                 <li>
                  <router-link :to="{name: 'ChangePassword'}">Change Password</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'DeleteAccount'}">Delete Account</router-link>
                </li>
              </ul>
            </transition>
          </ul>
        </div>

        <div v-if="adminLoggedIn || !isLoggedIn" class="admin-panel">
          <ul>
            <li @click="toggleAdminLinks" @mouseover="showAdminLinks">
              Admin <i class="fas fa-sort-down sort-icon"></i>
            </li>
          </ul>
          <ul v-bind:class="adminLinksObject" @mouseleave="hideAdminLinks">
            <li v-if="!adminLoggedIn">
              <router-link :to="{ name: 'AdminLogin' }">Login</router-link>
            </li>
            <li v-if="adminLoggedIn">
              <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
            </li>
            <li class="admin-logout" v-if="adminLoggedIn">
              <p @click="logoutUser">Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import axios from 'axios';
import '@firebase/firestore';
import '@firebase/auth';

export default {
  name: 'Navbar',
  data() {
    return {
      menuOpen: false,
      linksVisible: false,
      adminLinksVisible: false,
      isLoggedIn: false,
      userName: '',
      userID: '',
      adminLoggedIn: false,
      userHasRestaurant: null,
      db: firebase.firestore(),
      settingsLinkVisible: false,
    };
  },

  beforeUpdate() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  },

  watch: {
    isLoggedIn: async function() {
      if (this.isLoggedIn && !this.adminLoggedIn) {
        await this.determineEditRestaurantLink();
      }

      if (this.isLoggedIn) {
        this.firstName = this.getCurrentUserName(
          firebase.auth().currentUser.uid
        );

        this.adminLoggedIn = this.getCurrentlyLoggedIn();
      }
    },
  },

  methods: {

    showSettings () {
      // mouseover
      this.settingsLinkVisible = true;
    },

    hideSettings () {
      // mouseleave
      this.settingsLinkVisible = false;
    },

    toggleSettings () {
      // click
      this.settingsLinkVisible = !this.settingsLinkVisible;
    },




    getCurrentlyLoggedIn() {
      const id = firebase.auth().currentUser.uid;

      const adminDocRef = this.db.collection('users').doc(id);

      adminDocRef.get().then((doc) => {
        if (doc.exists) {
          if (doc.data().isAdmin) {
            this.adminLoggedIn = true;
          }
        }
      });
    },

    async determineEditRestaurantLink() {
      let result;

      const currentUserId = firebase.auth().currentUser.uid;

      const FIREBASE_FUNCTION_NAVIGATION_AUTH_LINK =
        process.env.VUE_APP_NAVIGATION_EDIT_RESTAURANT_LINK;

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

      try {
        result = await axios({
          method: 'POST',
          url: FIREBASE_FUNCTION_NAVIGATION_AUTH_LINK,
          headers: {
             'content-type': 'application/json',
             Accept: 'application/json',
             Authorization: `Bearer ${idToken}`

          },
          data: {
            currentUserId,
          },
        });

        const { data } = await result;

        if (data.body.response.hasRestaurant === true) {
          this.userHasRestaurant = true;
        }

        if (data.body.response.hasRestaurant === false) {
          this.userHasRestaurant = false;
        }
      } catch (err) {
        console.log(err.message);
      }
    },

    closeMenuOnClickLink(event) {
      if (event.target.tagName === 'A' || event.target.className === 'logout') {
        this.menuOpen = false;
      }
    },

    toggleLinks() {
      this.linksVisible = !this.linksVisible;
    },

    toggleAdminLinks() {
      this.adminLinksVisible = !this.adminLinksVisible;
    },

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    showAdminLinks() {
      this.adminLinksVisible = true;
    },

    hideAdminLinks() {
      this.adminLinksVisible = false;
    },

    showLinks() {
      this.linksVisible = true;
    },

    hideLinks() {
      this.linksVisible = false;
    },

    logoutUser() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.isLoggedIn = false;

          this.userName = '';

          if (this.adminLoggedIn) {
            this.adminLoggedIn = false;

            this.$router.push({ name: 'AdminLogin' });
          } else {
            this.$router.push({ name: 'Login' });
          }
        });
    },

    getCurrentUserName(userId) {
      if (userId !== null) {
        const docRef = this.db.collection('users').doc(userId);

        docRef.get().then((doc) => {
          if (doc.exists) {
            this.userName = doc.data().firstName;
          }
        });
      }
    },
  },
  computed: {
    menuObject: function() {
      return {
        'menu-container': this.menuOpen,
        'hide-menu': !this.menuOpen,
      };
    },
    linksObject: function() {
      return {
        'secondary-links': this.linksVisible,
        'hide-links': !this.linksVisible,
      };
    },
    adminLinksObject: function() {
      return {
        'admin-links': this.adminLinksVisible,
        'hide-links': !this.adminLinksVisible,
      };
    },
  },
};
</script>

<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;



//****TRANSITIONS****/
.fade-settings-enter-active, .fade-settings-leave-active {
  transition: opacity .75s;
}
.fade-settings-enter, .fade-settings-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
//****END TRANSITIONS****/


.settings-panel-link {
  cursor: pointer;
}

.navbar .delete-account-link-list {
   margin: 0;
   width: 100% ;
 }

 .navbar .delete-account-link-list li {
   margin: 0;
   padding: 0.3rem;
   border: 1px solid $gray;
 }


 .navbar .delete-account-link-list li a {
   display: block;
   width: 100%;
   font-size: 0.8rem;
 }



.sort-icon {
  color: $red;
}

.admin-links {
  border: 1px solid $gray;
  font-size: 0.8rem;
  animation-name: fadein;
  animation-duration: 0.5s;

  li {
    border-bottom: 1px solid $gray;
    width: 100%;
    margin: 0 !important;
    padding: 0.3rem 0;
  }

  li:last-of-type {
    border-bottom: none;
  }
}

.main-links {
  p {
    cursor: pointer;
    color: $black;
    margin: 0;
  }
}

.admin-panel {
  p {
    color: $black;
    margin: 0;
    width: 100px;
  }
  ul {
    margin: 0;
  }
  li {
    list-style: none;
    cursor: pointer;
  }
}
.navbar > li {
  list-style-type: none;
}

.hamburger-container {
  display: flex;
  justify-content: space-between;
  li {
    list-style-type: none;
  }
}

.menu-heading {
  background-color: $blue;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    text-align: center;
    color: $offwhite;
    margin: 0;
  }
}

.menu-container {
  position: absolute;
  right: 0;
  border: 1px solid $gray;
  background-color: whitesmoke;
  height: 60vh;
  width: 220px;
  animation-name: slideinMenu;
  animation-duration: 0.6s;
  z-index: 10;
}

.secondary-links {
  border: 1px solid $gray;
  animation-name: fadein;
  animation-duration: 0.5s;
  li {
    border-bottom: 1px solid $gray;
    width: 100%;
    margin: 0 !important;
    padding: 0.3rem 0;
    font-size: 0.8rem;
    text-align: left;
  }
}

.secondary-links-container {
  width: 100%;
  position: relative;
  li {
    color: $black;
    margin-bottom: 2rem;

    cursor: pointer;
  }

  i {
    margin-left: 0.2rem;
  }
}

.navbar {
  background-color: $red;
  position: relative;

  img {
    width: 70px;
  }
  ul {
    list-style-type: none;
    margin: 0 auto;
    width: 50%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 65%;
    li {
      margin: 0.6rem 0.5rem;
      padding-bottom: 0.2rem;
    }
  }

  li a {
    text-decoration: none;
    color: $black;
  }

  .hamburger-menu {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    div {
      height: 3px;
      background-color: $offwhite;
      margin: 0.2rem 0;
    }
    .line-1 {
      width: 35px;
    }
    .line-2 {
      width: 25px;
    }
    .line-3 {
      width: 35px;
    }
  }

  .hide-menu {
    animation-name: slideoutMenu;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    position: absolute;
    right: 50px;
    overflow: hidden;
  }

  .hide-links {
    animation-name: fadeout;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    font-size: 0.8rem;
    border: 1px solid $gray;
    li {
      margin: 0;
      border-bottom: 1px solid $gray;
      padding: 0.2rem 0;
    }
  }
}

@media (max-width: 650px) {
  .menu-container {
    width: 100%;
    align-items: center;
    justify-content: start;
    height: 100vh;
  }
  .navbar ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 50%;
  }

  .secondary-links-container {
    text-align: center;
    width: 150px;
    li {
      text-align: center;
    }
  }

  .admin-panel {
    width: 150px;
    text-align: center;
    margin: 0 auto;
    ul {
      width: 100%;
    }
  }

  .settings-panel-link {
    text-align: center;
  }
}

@keyframes slideinMenu {
  from {
    width: 0px;
    opacity: 0;
  }
  to {
    width: 220px;
    opacity: 1;
  }
}

@keyframes slideoutMenu {
  from {
    width: 220px;
    opacity: 1;
  }
  to {
    width: 0px;
    opacity: 0;
  }
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
