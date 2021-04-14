<template>
  <div class="admin-transactions-container">
    <DashBoardBackBtn />
    <AdminTransactionsHeader />
    <div class="transaction-tables-container">
      <AdminChargesTable
        v-if="dataIsLoaded"
        :charges="charges"
        :lastChargeOnPage="lastChargeOnPage"
        @fetchmore="loadMoreData"
        :totalTransactions="totalTransactions"
        :chargesTotal="chargesTotal"
      />
      <AdminPaymentsTable
        v-if="dataIsLoaded"
        :payments="payments"
        :totalTransactions="totalTransactions"
        :lastPaymentOnPage="lastPaymentOnPage"
        :paymentsTotal="paymentsTotal"
        @fetchmore="loadMoreData"
      />
    </div>
    <div class="admin-transaction-meta-message">
      <h3>
        <span>*</span>If you see any irregularities or missing fields, please report to the support team.
      </h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import { firebase } from '@firebase/app';

import DashBoardBackBtn from '../../components/DashBoardBackBtn';
import AdminTransactionsHeader from '../../components/AdminTransactionsHeader';
import AdminChargesTable from '../../components/AdminChargesTable';
import AdminPaymentsTable from '../../components/AdminPaymentsTable';

export default {
  name: 'AdminTransactions',

  props: {},

  components: {

    DashBoardBackBtn,
    AdminChargesTable,
    AdminPaymentsTable,
    AdminTransactionsHeader,
  },

  data() {
    return {
      currentUserId: firebase.auth().currentUser.uid,
      transactionResponseError: '',
      payments: [],
      charges: [],
      lastPaymentOnPage: '',
      lastChargeOnPage: '',
      dataIsLoaded: false,
      totalTransactions: 0,
      chargesTotal: 0,
      paymentsTotal: 0,

    };
  },

  created() {
    this.getTransactionData();
  },

  mounted() {

  },

  methods: {
    async getTransactionData() {
      try {
        const url = process.env.VUE_APP_ADMIN_TRANSACTION_DATA;

        const method = 'POST';

        const requestData = {
          currentUserId: this.currentUserId,
        };

        const response = await this.sendFireBaseRequest(
          requestData,
          method,
          url
        );

        const {
              status,
              error,
              payments,
              charges,
              size,
              paymentsTotal,
              chargesTotal } = response.data.body;

        if (status === 401 && charges === null) {
          // check against non-admin to trigger -> "azP3r4SOrsb84gwkODistikEPu03"
          this.transactionResponseError = error;
        }

        if (status === 200 && error === null) {

          this.totalTransactions = size;

          this.payments =  this.sortTransactionsDescending(payments);

          this.charges =  this.sortTransactionsDescending(charges);

          this.chargesTotal = chargesTotal;

          this.paymentsTotal = paymentsTotal;

          this.lastPaymentOnPage = this.payments[this.payments.length - 1];

          this.lastChargeOnPage = this.charges[this.charges.length - 1];
        }

        this.dataIsLoaded = true;
      } catch (err) {
        console.log(err);

        console.log(err.message);
      }
    },

   sortTransactionsDescending (transactions) {

      const descendingSort = transactions
      .sort(
        (dateA, dateB) => {

          if (dateA.createdAt < dateB.createdAt) {

            return 1;
          } else if (dateA.createdAt > dateB.createdAt) {

            return -1;
          } else {

            return 0;
          }
        }
      );
      return descendingSort;
   },

    async sendFireBaseRequest(data, method, url) {
      try {

      const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

        let response;

        response = await axios({
          method,
          url,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },

          data,
        });

        return response;
      } catch (err) {
        console.log(err);
        console.log(err.message);
      }
    },

    async loadMoreData({ batch }) {

        try {

          const url = process.env.VUE_APP_LOAD_MORE_DATA;

          const method = 'POST';

          const requestData = {

            resource: batch.resource,

            lastItemOnPage: batch.lastItem,
          };

          const response = await this.sendFireBaseRequest(requestData, method, url);

          const {statusCode, data, resource, error} = response.data.body;


          if (statusCode === 200 && error === null) {

                this.addNextBatch(resource, data);
          }

        } catch (err) {

          console.log(err);
          console.log(err.message);
        }

    },

    addNextBatch (resource, data) {

        if (resource === 'charges') {

          data.forEach((transaction) => {

            this.charges.push(transaction);
          });

          this.lastChargeOnPage = this.charges[this.charges.length -1];
        } else if (resource === 'payments') {

          data.forEach((transaction) => {

            this.payments.push(transaction);

          });

          this.lastPaymentOnPage = this.payments[this.payments.length -1];
        }

    }
  },
};
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;


.admin-transactions-container {
  background-color: lighten(#f5f5f5, 2);
  padding-bottom: 2rem;

}

.transaction-tables-container {
  // width: 95%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 1rem;

}

.admin-transaction-meta-message {
  text-align: center;

  span {
    margin-right: 0.3rem;
    font-size: 1.4rem;
    color: $red;
  }

  h3 {
    color: lighten($black, 7);
  }
}

@media (max-width: 600px) {

  .transaction-tables-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
}

</style>
