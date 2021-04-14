<template>
  <div class="admin-charges-table-container">
    <h3>Charges</h3>
    <table class="admin-charges-table">
      <tr>
        <th>Date</th>
        <th>Customer ID</th>
        <th>Card Type</th>
        <th>Amount</th>
      </tr>
      <tr class="charge-row" v-for="charge in charges" :key="charge.id">
        <td>{{ charge.formattedDate }}</td>
        <!-- <td>{{ charge.name  }}</td> -->
        <td>{{ charge.associatedUserId  }}</td>
        <td>{{ charge.cardbrand }}</td>
        <td>{{ charge.amount }}</td>
      </tr>
    </table>
    <div v-if="totalTransactions !== charges.length" class="load-more-charges">
      <button @click="fetchMoreCharges({lastItem: lastChargeOnPage, resource: 'charges'})">Older Charges...</button>
    </div>
    <div class="charges-total">
      <p><span>Total Charged:</span>${{ chargesTotal }}</p>
    </div>
  </div>
</template>



<script>

export default {

  name: 'AdminChargesTable',

  props: {
    charges: Array,
    lastChargeOnPage: Object,
    totalTransactions: Number,
    chargesTotal: String,
  },

  components: {

  },

  data () {

    return {

    }
  },

  mounted () {

  },

  created () {

  },

  computed: {


  },

  methods: {

    fetchMoreCharges (batch) {

       this.$emit('fetchmore',
        {
          batch,
        }
       );
    }
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

.admin-charges-table-container {
  width: 45%;
  background-color: #fff;
  border: 1px solid $gray;
  border-radius: 7px;
  margin-bottom: 3rem;
  overflow-x:auto;
  height: 600px;

  h3 {
    margin-left: 1rem;
  }
}

.admin-charges-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th {
    color: darken($gray, 15);
    font-size: 0.8rem;
  }

  th, td {
    text-align: left;
  }
}

.charge-row {
  border-bottom: 1px solid lighten($gray, 5);
  height: 40px;

  &:nth-of-type(odd) {
    background-color: lighten($gray, 3);
  }

  td {
    font-size: 0.9rem;
  }
}

.charges-total {
  text-align: right;
  margin: 0;
  padding: 0.3rem;
  margin-right: 0.3rem;

  p {
    font-weight: bold;
  }

  span {
    font-weight: normal;
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }
}


.load-more-charges {
  margin: 2rem auto;
  margin-bottom: 1rem;
  text-align: center;

  button {
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    border: none;
    height: 25px;
    font-size: 0.7rem;
    border-radius: 2px;
    background-color: darken($gray, 5);
    &:hover {
      background-color: $gray;
    }
  }
}

@media (max-width: 600px) {

  .admin-charges-table-container {
    width: 95%;

  }
}

</style>