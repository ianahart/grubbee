<template>
  <div class="payment-billing-information">
    <div class="billing-address-header">
      <h2><span class="number-step">1</span>Billing Address</h2>
    </div>
    <div class="billing-address-names">
      <PaymentBillingInformationField
        :label="form.firstName.label"
        :input="form.firstName.name"
        :error="form.firstName.error"
        :styles="form.firstName.styles"
        :type="form.firstName.type"
        @fieldBlur="handleFieldBlur"
      />
       <PaymentBillingInformationField
        :label="form.lastName.label"
        :input="form.lastName.name"
        :error="form.lastName.error"
        :styles="form.lastName.styles"
        :type="form.lastName.type"
        @fieldBlur="handleFieldBlur"
      />
    </div>
    <PaymentBillingInformationField
      :label="form.address.label"
      :input="form.address.name"
      :error="form.address.error"
      :styles="form.address.styles"
      :type="form.address.type"
      @fieldBlur="handleFieldBlur"
    />

    <PaymentBillingInformationField
      :label="form.city.label"
      :input="form.city.name"
      :error="form.city.error"
      :styles="form.city.styles"
      :type="form.city.type"
      @fieldBlur="handleFieldBlur"
    />
    <div class="state-zip-container">
      <PaymentBillingInformationField
        :label="form.state.label"
        :input="form.state.name"
        :error="form.state.error"
        :styles="form.state.styles"
        :type="form.state.type"
        @fieldBlur="handleFieldBlur"
        @select="handleSelectedOption"
        :states="form.state.states"
      />
      <PaymentBillingInformationField
        :label="form.zipCode.label"
        :input="form.zipCode.name"
        :error="form.zipCode.error"
        :styles="form.zipCode.styles"
        :type="form.zipCode.type"
        @fieldBlur="handleFieldBlur"
      />
    </div>
      <p class="empty-errors" v-if="emptyFieldsAndErrors.errorEmpty === false || emptyFieldsAndErrors.modelEmpty === true">Please make sure all the fields are not left empty</p>
      <div class="load-payment-section-btn">
        <button @click.prevent="loadPaymentSection(true)">continue</button>
      </div>
  </div>
</template>



<script>

import produce from 'immer';

import { states } from '../data/states.js';
import PaymentBillingInformationField from './PaymentBillingInformationField';


  export default {

    name: 'PaymentBillingInformation',

    props: {

    },

    components: {

       PaymentBillingInformationField,
    },

    data () {

      return {
        form: {
          firstName: {
            label: 'First Name:',
            name: 'firstName',
            error: '',
            styles: 'billing-first-name',
            type: 'text',
            model: '',
          },

          lastName: {
            label: 'Last Name:',
            name: 'lastName',
            error: '',
            styles: 'billing-last-name',
            type: 'text',
            model: '',
          },

          address: {
            label: 'Address:',
            name: 'address',
            error: '',
            styles: 'billing-address',
            type:'text',
            model: '',
          },

          city: {
            label: 'City:',
            name: 'city',
            error: '',
            styles: 'billing-city',
            type:'text',
            model: '',
          },

          state: {
            label: 'State:',
            name: 'state',
            error: '',
            styles: 'billing-state',
            type: 'text',
            model: '',
            states,
            inputIsAState: false,
          },

          zipCode: {
            label: 'Zip Code:',
            name: 'zipCode',
            error: '',
            styles: 'billing-zip',
            type: 'text',
            model: '',
          }
        },
        stateNames: [],

        emptyFieldsAndErrors: {

          modelEmpty: false,

          errorEmpty: true,

        },

        isbillingCompShowing: false,
        isPaymentCompShowing: false,
      }
    },

    created () {

    },

    mounted () {

      this.getStateNames(states);
    },

    methods: {

      loadPaymentSection(bool) {

        for (let obj in this.form) {

          for (let prop in this.form[obj]) {

            if (prop === 'model' && this.form[obj]['model'].length === 0) {

              this.emptyFieldsAndErrors.modelEmpty = true;

          }

            if (prop === 'error' && this.form[obj]['error'].length) {

                this.emptyFieldsAndErrors.errorEmpty = false;

            }
        }
      }

    if (this.emptyFieldsAndErrors.errorEmpty && !this.emptyFieldsAndErrors.modelEmpty) {

         const baseState = {...this.form};

        const allowedKeys = ['name', 'model'];

        const nextState = produce(baseState, draftState => {

          for(let obj in draftState) {


          for (let prop in draftState[obj]) {

            if (!allowedKeys.includes(prop)) {

                delete draftState[obj][prop];
            }
          }
        }
      });
        this.$emit('showPayment', {

          bool,

          nextState,
        });
      }
    },

    handleFieldBlur ({ inputData }) {

      this.emptyFieldsAndErrors.errorEmpty = true;

      this.emptyFieldsAndErrors.modelEmpty = false;

        for (let obj in this.form) {

          for(let prop in this.form[obj]) {

              if (inputData.name === this.form[obj][prop]) {

                  this.form[obj].model = inputData.value;
              }
          }
        }

        this.validateField(inputData);
    },

    handleSelectedOption ({ inputData }) {

      this.form.state.model = inputData.value;

      this.validateField(inputData);
    },

      formatDynamicErrorMessages (name) {

        const formatted = name.split('').map(
          (letter, index) => {

            if (letter === letter.toUpperCase()) {

              return ' ' + letter.toLowerCase();
            } else if (index <= 0) {

              return letter.toUpperCase();
            }

            return letter;
          }
        );

        return formatted.join('');
      },

      validateField ({ name, value }) {

        const lettersOnlyRegex = /^[a-zA-Z ]+$/;

        const addressRegex = /^[\w\s.-]+$/i;

        const numberRegex = /^[0-9-]+$/;

        const letterOnlyFields = ['firstName', 'lastName', 'city'];

        if (letterOnlyFields.includes(name)) {

          const fieldNameError = this.formatDynamicErrorMessages(name);

          if (value.length > 40) {

            this.form[name].error = `${fieldNameError} must not exceed 40 characters`;
          } else if (value.length < 2) {

            this.form[name].error = `${fieldNameError} must be at least 2 characters`;
          } else if (!lettersOnlyRegex.test(String(value))) {

            this.form[name].error = `Please use only letters and spaces for ${fieldNameError}`;
          } else {

            this.form[name].error = '';
          }
        } else if (name == 'address') {

          const fieldNameError = this.formatDynamicErrorMessages(name);

          if (value.length < 5) {

            this.form[name].error = `${fieldNameError} must be at least of 5 characters`;
          } else if (value.length > 75) {

            this.form[name].error = `${fieldNameError} must not exceed 75 characters`;
          } else if (!addressRegex.test(String(value).toLowerCase())) {

            this.form[name].error = `${fieldNameError} Please use only letters, spaces, hyphens and periods`;
          } else {

            this.form[name].error = '';
          }
        } else if (name === 'state') {

          const fieldNameError = this.formatDynamicErrorMessages(name);

         if (!this.stateNames.includes(value.toLowerCase())) {

            this.form[name].error = `"${value}" is not a state`;

          }  else if (value.length > 45) {

            this.form[name].error = `${fieldNameError} must not exceed 50 characters`;
          } else if (!lettersOnlyRegex.test(String(value).toLowerCase())) {

            this.form[name].error = `Please use only letters and spaces for ${fieldNameError}`;
          } else {
            this.form[name].error = '';
          }

        } else if (name === 'zipCode') {

         const fieldNameError = this.formatDynamicErrorMessages(name);

         if (value.length === 0) {

           this.form[name].error = `${fieldNameError} cannot be empty`;
         } else if (value.length > 10) {

           this.form[name].error = `${fieldNameError} cannot exceed 10 numbers`;
         } else if (!numberRegex.test(String(value))) {

           this.form[name].error = `Please use only numbers and hyphens (optional) for ${fieldNameError}`;
         } else {

           this.form[name].error = '';
         }
       }
      },

      getStateNames(stateObjs) {

        stateObjs.forEach(
          (obj) => {

          for (let prop in obj) {

            if (prop === 'text') {

              this.stateNames.push(obj[prop].toLowerCase());
            }
          }
        });
      },
    },
  }
</script>



<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

.billing-address-header {
  width: 100%;
  margin: 0 auto;
  h2 {
    width: 90%;
    margin: 2rem auto;
    display: flex;
    align-items: center;
    color: lighten(darkslategrey, 5);
  }
}

.empty-errors {
  color: $red;
  text-align: center;
}


.load-payment-section-btn{
  margin: 2rem auto;
  display: flex;
  justify-content: center;

  button {
    margin-right: 1rem;
    cursor: pointer;
    padding: 0.3rem 0.4rem;
    height: 30px;
    border-radius: 5px;
    width: 120px;
    font-size: 1rem;

    transition: all 0.5s ease-in-out;
    background-color: $gray;
    border: none;
    &:hover {
      background-color: darken($gray, 10);
    }
  }
}


.billing-name-on-card,
.billing-address,
.billing-city {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 2rem auto;

  label {
    margin-bottom: 0.2rem;
    color: $lightBlue;
  }

  input {

    border-radius: 5px;
    padding: 1rem;
    border: none;
    border: 1px solid $gray;
    outline: none;
  }

  p {
    text-align: center;
    color: $red;
  }
}

.billing-address-names,
.state-zip-container {
  width: 100%;
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.billing-first-name,
.billing-last-name,.billing-zip,
.billing-state {
  display: flex;
  flex-direction: column;
  width: 45%;
  margin: 0 auto;

  label {
    margin-bottom: 0.2rem;
    color: $lightBlue;
  }

  input {

    border-radius: 5px;
    padding: 1rem;
    border: none;
    border: 1px solid $gray;
    outline: none;
  }

  p {
    text-align: center;
    color: $red;
  }
}

.billing-address-names {
  display: flex;
  justify-content: center;
}

.billing-zip {
  width: 30%;
}

.billing-state {
  width: 60%;
  position: relative;
}


@media(max-width:600px) {
  .billing-address-header {
    width: 90%;
  }

  .billing-address-names {
    display: flex;
    flex-direction: column;
  }

  .billing-first-name,
  .billing-last-name {
    width: 90%;
    margin: 0.75rem auto;
  }
}
</style>