<template>
  <div id="app">
        <Navbar />
        <div class="app-content">
          <router-view />
        </div>
        <Footer />
  </div>
</template>
<script>




import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

 export default {
   name: 'App',
   components: {
     Navbar,
     Footer
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
@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}

body {
  font-family: 'Quicksand', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  width: 100%;
}

.app-content {
  flex: 1 0 auto;
}
</style>
