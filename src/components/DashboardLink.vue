<template>
  <div
    @mouseover="showActive"
    @mouseleave="hideActive"
    class="dashboard-link"
    >
    <router-link
    :to="path"
    >
      <img :src="require(`../assets/${fileName}.svg`)" alt="bar chart"/>{{ text }}
   </router-link>
   <transition name="slide-underline">
      <div v-if="isActive" class="link-active-underline"></div>
   </transition>
  </div>
</template>



<script>
  export default {
    name: 'DashboardLink',
    props: {
      text: String,
      path: Object,
      fileName: String,
    },
    data() {
      return {
        isActive: false,
      }
    },

    methods: {
      showActive() {

        this.isActive = true;
      },

      hideActive() {

        this.isActive = false;
      }
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


/****TRANSITIONS****/

.slide-underline-enter-active, .slide-underline-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-underline-enter {
  opacity: 0;
  transform: translateY(100px);
}

.slide-underline-leave-to {
  opacity: 0;
}


/****END TRANSITIONS****/

.link-active-underline{
  height: 2px;
  background-color: $black;
  width: 50%;
  margin-left: 1.2rem;

}

</style>