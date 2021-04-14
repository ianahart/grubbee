<template>
  <div class="change-password-form-field">
      <label>{{ fieldData.label }}</label>
      <input
        :class="inputClass"
        @click="sendResetField(currentInput)"
        @blur="sendCurrentInput(currentInput)"
        type="password"
        v-model="currentInput.model"

        />
      <!-- change to type="password" -->
      <transition name="fade-change-password-error">
        <p v-if="fieldData.error" class="change-password-form-field-error">{{ fieldData.error }}</p>
      </transition>
  </div>
</template>


<script>

  export default {

    name: 'ChangePasswordFormField',

    props: {

      fieldData: Object,
      formValuesCancelled: Boolean,
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

      formValuesCancelled: function () {

        this.currentInput.model = '';
      },
    },

    computed: {

      inputClass:function () {

        return {

          'input-error' : this.fieldData.error.length > 0,
          'input-no-error':this.fieldData.error.length <= 0,
        }
      }
    },

    methods: {

     sendCurrentInput (input) {

        this.sendEvent('inputchange', input);

      },

      sendResetField (input) {

        this.sendEvent('reset', input);

      },

      sendEvent(event, payload) {

        this.$emit(event,
          {
            payload,
          }
        );
      }
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


//****TRANSITIONS****/
.fade-change-password-error-enter-active, .fade-change-password-error-leave-active {
  transition: all .75s;
}
.fade-change-password-error-enter, .fade-change-password-error-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(75px);
}
//****END TRANSITIONS****/



.change-password-form-field {
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0;

  input {
    width: 80%;
    height: 40px;
    border-radius: 7px;
    transition: all 0.25s ease-in-out;
  }

  label {
    margin-bottom: 0.3rem;
    color: lighten($black, 5);
  }
}


.input-no-error {
  border: 1px solid darken($gray, 5);
}

.input-error {
  border: 2px solid $red;
}


.change-password-form-field-error {
  color: $red;
  text-align: left;
  margin-left: 1rem;
  font-size: 0.85rem;
  font-weight: bold;
}

@media (max-width: 600px) {
  .change-password-form-field {
    margin: 1rem;

    input {
      width: 100%;

    }
  }
  .change-password-form-field-error {

    text-align: center;
  }
}

</style>