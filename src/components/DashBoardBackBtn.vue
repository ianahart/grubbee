<template>
  <div @click="goBack" class="dashboard-back-btn">
     <img src="../assets/arrow-left.svg" alt="back-arrow" />
     <p>Back to Dashboard</p>
  </div>
</template>



<script>
  export default {
    name: 'DashboardBackBtn',

    data() {
      return {

      }
    },

    methods: {
         goBack() {
        this.$router.push('/admin/dashboard');
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

.dashboard-back-btn {
  display: flex;
  cursor: pointer;
}

</style>