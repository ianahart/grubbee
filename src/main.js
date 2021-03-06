import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './db/firebase';


let app;

auth.onAuthStateChanged(() => {

  if (!app) {
    app = new Vue({
    router,
    render: h => h(App)
    }).$mount('#app')
  }
});

