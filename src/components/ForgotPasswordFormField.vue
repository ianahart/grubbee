<template>
  <div class="forgot-password-form-field">
    <label>{{ fieldData.label }}</label>
    <input
      type="password"
      v-model="currentInput.model"
      @blur="sendCurrentInput(currentInput)"
      @click="sendResetField(currentInput)"
    />
    <p
      v-if="fieldData.error"
      id="forgot-password-error">
      {{ fieldData.error }}
    </p>
  </div>
</template>


<script>

  export default {

    name: 'ForgotPasswordFormField',

    props: {

      fieldData: Object,
      inputReset: Boolean,

    },

    components: {

    },

    data () {

      return {
        currentInput : {
          marker: this.fieldData.marker,
          model: '',
        },
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

      inputReset: function () {

          if (this.inputReset) {

              this.currentInput.model = '';
          }

      },
    },

    methods: {


      emitEvent (event, data) {

        this.$emit(event,
          {
            data,
          }
        );
      },

      sendCurrentInput (input) {

        this.emitEvent('inputchange', input);
      },

      sendResetField (input) {

        this.emitEvent('resetfield', input);
      },

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


//****TRANSITIONS****/
// .fade-refund-modal-enter-active, .fade-refund-modal-leave-active {
//   transition: opacity .75s;
// }
// .fade-refund-modal-enter, .fade-refund-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
//****END TRANSITIONS****/

#forgot-password-error {
  color: $red;
  font-weight: bold;
  font-size: 0.85rem;
}

.forgot-password-form-field {

  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.2rem;
    color: lighten($black, 5);
    font-size: 1rem;
  }

  input {
    width: 50%;
    border: 1px solid darken($gray, 5);
    height: 35px;
    border-radius: 3px;
  }
}



@media (max-width: 600px) {

  .forgot-password-form-field {

    input {
      width: 80%;
    }
  }
}

</style>