<template>
  <div class="admin-user-list-form-input-single">
    <label>
      {{ label }}
    </label>
    <input
      type="text"
      v-model="currentInput"
      @keyup="initResetField($event, currentActiveForm)"
      @click="initResetField($event, currentActiveForm)"
      @blur="captureChange(currentInput)"
    />
    <p v-if="error.length" class="user-list-input-error">{{ error }}</p>
  </div>
</template>

<script>

  export default {

    name: 'AdminUserListFormInputSingle',

    props: {
      label: String,
      currentActiveForm: String,
      vModel: String,
      error: String,
    },

    components: {

    },

    data () {

      return {
        currentInput: '',
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

      currentActiveForm: function () {

        this.currentInput = '';
      },

    },

    methods: {

      sendEvent (event, data) {

        this.$emit(event,
          {
            data,
          }
        );
      },

      captureChange (input) {

         this.sendEvent('sendinput', input);
      },

      initResetField (event, currentForm) {

        if (event.type === 'keyup') {

          if (event.code === 'Tab')  {

              this.sendEvent('singleinputerror', currentForm);
          }
        }

        if (event.type === 'click') {

          this.sendEvent('singleinputerror', currentForm);
        }
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

.admin-user-list-form-input-single {
  display: flex;
  flex-direction: column;

  input {
    height: 35px;
    border: 1px solid darken($gray, 7);
    border-radius: 0.25rem;
  }

  label {
    margin-bottom: 0.4rem;
    margin-top: 0.3rem;
    color: $blue;
  }
}

.user-list-input-error {
  font-size: 0.85rem;
  color: $red;
  font-weight: 900;
  text-align: left;
}

</style>