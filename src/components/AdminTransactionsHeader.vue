<template>
  <div class="admin-transactions-header">
    <header>
      <h1>Customer Transactions</h1>
      <div class="transactions-title-underline"></div>
    </header>
  </div>
</template>


<script>

export default {

  name: 'AdminTransactionsHeader',

  props: {

  },

  components: {

  },

  data () {

    return {

    }
  },

  created () {

  },

  mounted () {

  },

  methods: {

  },
}
</script>



<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.admin-transactions-header {

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: lighten($gray, 2);
  padding-bottom: 2rem;

  header {

    h1 {
      margin-bottom: 0.2rem;
      color: $black;
      font-weight: 100;
    }
  }
}

.transactions-title-underline {
  height: 3px;
  background-color: $lightBlue;
  margin-bottom: 2rem;
}

</style>