<template>
  <div class="dashboard">
    <!-- <div class="admin-header-background">
    </div> -->
    <div class="admin-dashboard-container">
    <div class="admin-menu-panel">
      <div @click="handleMenuToggle" class="admin-sidebar">
        <div class="dots">
          <i class="far fa-circle"></i>
          <i class="far fa-circle"></i>
          <i class="far fa-circle"></i>
        </div>
        <div class="sidebar-action-btn">
          <img v-if="menuShowing" src="../../assets/x.svg"  alt="close icon" />
          <img v-if="!menuShowing" src="../../assets/sidebar.svg" alt="sidebar icon" />
        </div>
      </div>
      <transition name="fade-side-menu" tag="div">
        <div v-if="menuShowing"  class="admin-menu">
          <div class="admin-menu-header">
            <header>
              <i class="fas fa-user-circle"></i>
              <h3>Welcome back,</h3>
              <h2>Admin</h2>
            </header>
          </div>
          <div class="admin-menu-nav">
            <nav>
              <ul>
                <li>
                  <DashboardLink
                   :path="{name: 'Dashboard'}"
                    text="Dashboard"
                    fileName="bar-chart"
                  />
                </li>
                <li>
                  <DashboardLink
                  :path="{name: 'AdminUserList' /*, query: {page: 1}*/ }"

                    text="Users"
                    fileName="users"
                  />
                </li>
                <li>
                  <DashboardLink
                    :path="{name: 'AdminComments'}"
                    text="Comments"
                    fileName="message-circle"
                 />
                </li>
                <li>
                  <DashboardLink
                    :path="{name: 'AdminFlaggedComments'}"
                    text="Flagged Comments"
                    fileName="flag"
                  />
                </li>
                <li>
                  <DashboardLink
                    :path="{name: 'AdminArchivedComments'}"
                    text="Archives"
                    fileName="archive"
                  />
                </li>
                <li>
                <DashboardLink
                  :path="{name: 'AdminTransactions'}"
                  text="Transactions"
                  fileName="dashboard-credit-card"
                />
              </li>
              </ul>
            </nav>
          </div>
        </div>
      </transition>
    </div>
    <div class="admin-page-viewer">
      <h1><img src="../../assets/activity.svg" alt="activity"/> Usage Statistics</h1>
      <div class="all-charts-container">
        <div class="comments-chart-container">
            <h3><img src="../../assets/message-square.svg" alt="square message" /> Comments</h3>
            <div class="chart-wrapper">
              <CommentsChart   />
            </div>
        </div>
        <div class="users-chart-container">
          <h3><img src="../../assets/user.svg" alt="user" /> User Signups</h3>
          <div class="chart-wrapper">
            <UsersChart
              :db="db"
              :currentYear="currentYear"
            />
          </div>
        </div>
      </div>
   </div>
  </div>
  </div>
</template>

<script>

//:path="{name: 'AdminUserList', query: {page: 1}}"
        //:path="{name: 'AdminUserList'}"

import {firebase} from '@firebase/app';

import DashboardLink from '../../components/DashboardLink';
import CommentsChart from '../../components/CommentsChart';
import UsersChart from '../../components/UsersChart';


export default {
  name: 'Dashboard',
  components: {
    CommentsChart,
    UsersChart,
    DashboardLink
  },
  data() {
    return {
      menuShowing: true,
      db: firebase.firestore(),
      currentYear: new Date().getFullYear(),
    };
  },

  methods: {
    handleMenuToggle () {
      this.menuShowing = !this.menuShowing;
    }

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

//****TRANSITIONS****/
.fade-side-menu-active, .fade-side-menu-leave-active {
  transition: all 0.5s ease-in-out;

}

.fade-side-menu-enter, .fade-side-menu-leave-to {
  opacity: 0;
  transform:translate(-200px);

}


//****END TRANSITIONS****/

body {
  min-height: 100%;
}
.dashboard {
  min-height: 100%;
  height: 100%;
}

.comments-chart-container ,.users-chart-container {

  margin: 4rem 0;
}

.sidebar-action-btn {
  position: absolute;
  top: 40%;
  left: 2%;
  img {
    height: 40px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
    border: 1px solid $gray;
  border-radius: 11px;
  padding: 0.5rem;
  box-shadow: 0px 7px 6px 1px rgba(0,0,0,0.4);
}

.admin-menu-header {
  text-align: center;
}

.admin-dashboard-container {
  display: flex;


  height: 100%;
}

.admin-page-viewer {
  text-align: center;
  width: 70%;
  margin: 0 auto;
}

.admin-menu-panel {
  display: flex;

}

.admin-sidebar {
  position: relative;
  width: 15%;
  min-width: 40px;
  background-color: $black;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  i {
    margin: 0.5rem 0;
    font-size: 1.9rem;
    color: $offwhite;
    transition: all 0.5s ease-in-out;
    &:hover {
      color: $lightBlue;
    }
  }
  &:hover {
    background-color: lighten($black, 10);
  }
}

.dots {
   display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-menu {
  padding: 1.5rem;
  background-color: lighten($gray, 5);
  transition: all 0.5s ease-in-out;


  header {
    display: flex;
    justify-content: center;
    height: 200px;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;

    i {
      color: darken($gray, 10);
      font-size: 3rem;
    }
  }

  h3 {
    margin-bottom: 0;
  }
}

.admin-menu-nav {
  nav {
    display: flex;
    justify-content: center;
  }

  ul {
    padding:0;
    height:400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    li {
      margin: 1rem 0;
    }

    img {
      margin-right: 0.5rem;
    }

    a {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-decoration: none;
      font-size: 0.9rem;
      color: $black;
    }
    i {
      color: $black;
      margin-right: 1rem;
    }
  }
}

.all-charts-container {
  width: 100%;
}


@media(max-width: 800px) {

  .admin-menu-panel {
    position: relative;
  }

  .admin-menu {
    position: absolute;
    z-index: 2;
    left: 100%;
  }
}

</style>
