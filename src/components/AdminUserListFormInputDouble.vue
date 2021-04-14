<template>
  <div class="admin-user-list-form-input-double">
    <label>{{ label }}</label>
    <div class="input-double-row">
      <input
        @blur="captureChange(inputs.startInput, 'startModel')"
        @click="initResetField($event, currentActiveForm)"
        type="text"
        v-model="inputs.startInput"
        placeholder="Start (mm/dd/yyyy)"
      />
      <input
        @blur="captureChange(inputs.endInput, 'endModel')"
        @click="initResetField($event, currentActiveForm)"
        type="text"
        v-model="inputs.endInput"
        placeholder="End (mm/dd/yyyy)"
      />
    </div>
      <p v-if="error" class="user-list-double-input-error">{{ error }}</p>
  </div>
</template>


<script>

  export default {

    name: 'AdminUserListFormInputDouble',

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

        inputs: {
          startInput: '',
          endInput: '',
        },

        valuesToSend: {
          startModel: '',
          endModel: '',
          startAction: false,
          endAction: false,

        },


      }
    },

    created () {

    },

    mounted () {

    },


    methods: {

        sendEvent(event, data) {

          this.$emit(event,
            {
              data,
            }
          );
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


        captureChange (input, name) {

              if (name === 'startModel') {

                this.valuesToSend[name] = input;

                this.valuesToSend['startAction'] = true;
             }

              if (name === 'endModel') {

                this.valuesToSend[name] = input;

                this.valuesToSend['endAction'] = true;
              }

          if (this.valuesToSend.startAction && this.valuesToSend.endAction)  {

            const valuesToSend = this.valuesToSend;

            this.sendEvent('senddoubleinput', valuesToSend);
          }
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

.admin-user-list-form-input-double {
  display: flex;
  flex-direction: column;


  label {
    margin-bottom: 0.4rem;
    margin-top: 0.3rem;
    color: $blue;
  }
}

.user-list-double-input-error {
  font-size: 0.85rem;
  color: $red;
  font-weight: 900;
  text-align: left;
}


.input-double-row {
  display: flex;
  box-sizing: border-box;
  width: 100%;

    input {
      height: 35px;
      border: 1px solid darken($gray, 7);
      border-radius: 0.25rem;
      margin: 0.5rem 1rem;
    }
  }


  @media(max-width: 600px) {

    .input-double-row {
      input {

        margin: 0.5rem auto;
      }

    }
  }

</style>