import { firebase } from '@firebase/app';

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Restaurants from '../views/Restaurants.vue';
import AddRestaurant from '../views/AddRestaurant.vue';
import EditRestaurant from '../views/EditRestaurant.vue';
import DeleteAccount from '../views/DeleteAccount.vue';
import ChangePassword from '../views/ChangePassword.vue';
import RestaurantPayment from '../views/RestaurantPayment.vue';
import RestaurantPaymentConfirmation from '../views/RestaurantPaymentConfirmation.vue';
import RestaurantMenu from '../views/RestaurantMenu.vue';
import FavoriteRestaurantReviews from '../views/FavoriteRestaurantReviews.vue';
import Favorites from '../views/Favorites.vue';
import Search from '../views/Search.vue';
import AddReview from '../views/AddReview.vue';
import About from '../views/About.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminUserList from '../views/admin/AdminUserList.vue';
import AdminFlaggedComments from '../views/admin/AdminFlaggedComments.vue';
import AdminComments from '../views/admin/AdminComments.vue';
import AdminArchivedComments from '../views/admin/AdminArchivedComments.vue';
import AdminTransactions from '../views/admin/AdminTransactions.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/restaurantmenu',
    name: 'RestaurantMenu',
    component: RestaurantMenu,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/editrestaurant',
    name: 'EditRestaurant',
    component: EditRestaurant,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/restaurantpayment',
    name: 'RestaurantPayment',
    component: RestaurantPayment,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/paymentconfirmation',
    name: 'RestaurantPaymentConfirmation',
    component: RestaurantPaymentConfirmation,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/addreview/:id?',
    name: 'AddReview',
    component: AddReview,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    component: Restaurants,
  },
  {
    path: '/addrestaurant',
    name: 'AddRestaurant',
    component: AddRestaurant,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/deleteaccount',
    name: 'DeleteAccount',
    component: DeleteAccount,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/changepassword',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {

      authRequired: true,
    },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/favorites/:id/reviews',
    name: 'FavoriteRestaurantReviews',
    component: FavoriteRestaurantReviews,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      adminRequired: true,
      authRequired: true,
    },
  },
  {
    path: '/admin/userlist',
    name: 'AdminUserList',
    component: AdminUserList,
    meta: {
      adminRequired: true,
      authRequired: true,
    }
  },
   {
    path: '/admin/comments',
    name: 'AdminComments',
    component: AdminComments,
    meta: {
      adminRequired: true,
      authRequired: true,
    }
  },
    {
    path: '/admin/flaggedcomments',
    name: 'AdminFlaggedComments',
    component: AdminFlaggedComments,
    meta: {
      adminRequired: true,
      authRequired: true,
    }
  },
  {
    path: '/admin/archivedcomments',
    name: 'AdminArchivedComments',
    component: AdminArchivedComments,
    meta: {
      adminRequired: true,
      authRequired: true,
    }
  },
  {
    path: '/admin/transactions',
    name: 'AdminTransactions',
    component: AdminTransactions,
    meta: {
      adminRequired: true,
      authRequired: true,
    }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const authenticated = firebase.auth().currentUser;

  const adminRequired = to.matched.some((record) => record.meta.adminRequired);

  const authRequired = to.matched.some((record) => record.meta.authRequired);



  let adminRef;

      if (authenticated) {
    adminRef = firebase
      .firestore()
      .collection('users')
      .doc(authenticated.uid);

    adminRef.get().then((doc) => {

      if (doc.exists) {

        if (!doc.data().isAdmin && adminRequired && authRequired) {
          next({ name: 'Home' });
        } else {
          next();

        }
      }
    });
  }


  const notAdminRoutes = [
    'AddRestaurant',
    'DeleteAccount',
    'RestaurantPayment',
    'EditRestaurant',
    'ChangePassword'
  ];

  const checkIfNotAdmin = () => {

    return   firebase.firestore()
              .collection('users')
              .where('userId', '==', authenticated.uid)
              .get()
  }

  if (authRequired && !authenticated) {
    next({ name: 'Login' });
  } else if (
    (to.name === 'Login' && authenticated) ||
    (to.name === 'Register' && authenticated)
  ) {
    next({ name: 'Home' });

  } else if (notAdminRoutes.includes(to.name) && authRequired) {

      checkIfNotAdmin()
      .then(
        (snapShot) => {

        snapShot.forEach(
          (doc) => {
            if (doc.data().isAdmin && authRequired) {

                next({name:'Home'});
            } else {

              next();
            }
        });
      });

  } else {

    next();
  }
});

export default router;
