<template>
  <div class="admin-payments-table-container">

    <h3>Payments</h3>
    <AdminPaymentsFilter
      @filter="setFilter"
    />
    <AdminPaymentsPDFButton
      @close="handleClosePDFPopUp"
      @download="handleDownloadPDF"
      :totalSelectedPayments="selectedPayments.length"

    />
    <table class="admin-payments-table">
      <tr>
        <th>Select</th>
        <th>Date</th>
        <th>Customer ID</th>
        <th>Card Type</th>
        <th>Status</th>
        <th>Amount</th>
      </tr>
      <AdminPaymentRow
        v-for="payment in reactivePayments" :key="payment.id"
        :payment="payment"
        @select="handleSelectPayment"
        :selectedWasReset="selectedWasReset"
      />
    </table>
    <div v-if="totalTransactions !== payments.length" class="load-more-payments">
      <button @click="fetchMore({lastItem: lastPaymentOnPage, resource: 'payments'})">Older Payments...</button>
    </div>
      <p class="payments-total"><span>Total Payments: </span>${{ paymentsTotal }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { saveAs } from 'file-saver';
import { firebase } from '@firebase/app';

import AdminPaymentsFilter from './AdminPaymentsFilter';
import AdminPaymentsPDFButton from './AdminPaymentsPDFButton';
import AdminPaymentRow from './AdminPaymentRow';

export default {

  name: 'AdminPaymentsTable',

  props: {

    payments: Array,
    totalTransactions: Number,
    paymentsTotal: String,
    lastPaymentOnPage: Object,
  },

  components: {

    AdminPaymentsFilter,
    AdminPaymentRow,
    AdminPaymentsPDFButton,
  },

  data () {

    return {
      filter: '',
      selectedPayments: [],
      selectedWasReset: false,

    }
  },

  mounted () {

  },

  created () {

  },


    computed: {

    reactivePayments: function() {

      return !this.filter.length ? this.payments : this.filterPayments();
    }
  },


  methods: {

    handleClosePDFPopUp () {

      this.selectedWasReset = !this.selectedWasReset;

      this.selectedPayments = [];
    },

    setFilter({ selectedFilter }) {

     this.filter = selectedFilter;
    },


    fetchMore(batch) {

      this.$emit('fetchmore',
        {

          batch,
        }
      );
    },

    filterPayments () {

      return this.payments.filter(
        (payment) => {

          return payment.status === this.filter;
         }
      );
    },

    handleSelectPayment ({ checkbox, payment }) {


      if (checkbox === false) {

        this.removeFromSelectedPayments(payment);
      }

      if (checkbox === true) {

        this.selectedPayments.push(payment);

      }
    },

    removeFromSelectedPayments(paymentToRemove) {

        this.selectedPayments = this.selectedPayments
        .filter(
          (selectedPayment) => {

          return paymentToRemove.id !== selectedPayment.id ? selectedPayment : '';

          }
        );
    },

    async handleDownloadPDF () {

      try {
          this.selectedWasReset = !this.selectedWasReset;

          const url = process.env.VUE_APP_SEND_PDF_DOWNLOAD;

          const method = 'POST';

          const response = await this.sendFirebaseRequest(url, method, this.selectedPayments);


          const { data } = response.data.body;

            this.decodeBase64Str(data);

          this.selectedPayments = [];
      } catch (err) {

        console.log('Error: ', err.message);
      }
    },

    decodeBase64Str (base64) {

      const binary = atob(base64.replace(/\s/g, ''));

      const len = binary.length;

      const buffer = new ArrayBuffer(len);

      const pdf = new Uint8Array(buffer);

      for (let i = 0; i < len; i++) {

        pdf[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([pdf], { type: 'application/pdf' });

      saveAs(blob, 'payments.pdf');

    },


    async sendFirebaseRequest(url, method, payments) {

        const idToken = await firebase
        .auth()
        .currentUser
        .getIdToken(true);

        console.log(firebase);

        let response;

      try {

        response = await axios(
          {
            url,

            headers: {

              'Accept': 'application/pdf',
              Authorization: `Bearer ${idToken}`



            },
            method,
            data: {
              payments,
            },
          }
        );

       return response;

      } catch (err) {

        console.log('Axios error: ', err.response.status);
      }
  },
}
}
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.admin-payments-table-container {
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
.admin-payments-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  margin-bottom: 2rem;

    th {
    color: darken($gray, 15);
    font-size: 0.8rem;
    padding: 0 0.5rem;
  }

  th, td {
    text-align: left;
  }
}

.payment-row {
  border-bottom: 1px solid lighten($gray, 5);
  height: 40px;

  &:nth-of-type(odd) {
    background-color: lighten($gray, 3);
  }

  td {
    font-size: 0.9rem;
  }
}


.payments-total {
  text-align: right;
  margin: 0;
  padding: 0.3rem;
  margin-right: 0.3rem;
  font-weight: bold;


  span {
    font-weight: normal;
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }
}

.load-more-payments {
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

.completed-payment {
  background-color: rgba(0, 220, 0, 0.2);

  td {
    &:nth-of-type(4n+0) {
      color: green;
      font-weight: bold;
    }
  }
}

.refunded-payment {
  background-color: rgba(0, 0, 0, 0.2);

   td {
    &:nth-of-type(4n+0) {
      color: darkslategrey;
      font-weight: bold;
    }
  }
}

.cancelled-payment {

  background-color: rgba(220, 0, 0, 0.2);

     td {
    &:nth-of-type(4n+0) {
      color: $red;
      font-weight: bold;
    }
  }
}

.completed-payment,
.refunded-payment,
.cancelled-payment {

  border-bottom: 1px solid lighten($gray, 5);
  height: 40px;
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


@media (max-width: 600px) {

  .admin-payments-table-container {
    width: 95%;

  }
}
</style>