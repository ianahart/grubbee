<template>
  <div :class="styles">
    <label>{{ label }}</label>
    <input
      :id="focusStyle"
      @keyup="detectInputChange(inputValue)"
      @focusout="sendInputData({ name: input, value: inputValue })"
      @focus="focusField(input)"
      type="search"
      v-model="inputValue"
      autocomplete="off"
    />
    <transition name="fade-error" appear>
      <p v-if="error">{{ error }}</p>
    </transition>
    <transition name="fade-select" appear>
      <div
          class="select-state"
          v-if="input === 'state' && isStateInFocus"
        >

          <span
            v-for="(state) in upperCasedStates"
            v-bind:key="state.id"
            @mousedown="handleStateSelection({ name: input, value: inputValue }, state)"
          >
            {{ state.text }}
          </span>
        </div>
    </transition>

  </div>
</template>



<script>


  export default {

    name: 'PaymentBillingInformationField',

    props: {

      label: String,
      input: String,
      error: String,
      styles: String,
      type: String,
      states: Array,

    },

    components: {

    },

    data () {

      return {

        inputValue: '',
        isFieldInFocus: false,
        isStateInFocus: false,
        isFieldMounted: false,
        clicked: false,
      }
    },

    created () {

    },

    mounted () {

      this.isFieldMounted = true;

    },

    computed: {

      focusStyle: function () {

         return   this.isFieldInFocus === true ? 'focus' : ''

      },

      upperCasedStates: function () {

          return this.isFieldMounted ? this.formatStates(this.states) : '';

      },
    },

    methods: {

      formatStates (states) {

        const arr = [];

        states.forEach((state) => {

          for (let prop in state) {

            if (prop === 'text') {

              const capitalizedState = this.capitalizeStates(state[prop]);

              state[prop] = capitalizedState;

              arr.push(state);
            }
          }
        });

        return arr;
      },

      capitalizeStates(stateName) {

          let arr = stateName.split(' ');

          let formattedState;

        if (arr.length > 1) {

          formattedState = arr.map(
            (word) => {

            return word
            .slice(0, 1)
            .toUpperCase() + word.slice(1);

          })
          .join(' ');
        } else if (stateName.split(' ').length <= 1) {

          formattedState = stateName
          .slice(0, 1)
          .toUpperCase() + stateName.slice(1);
        }

        return formattedState;
      },

      handleStateSelection (inputData, state) {


            this.clicked = true;


        this.isStateInFocus = false;

        this.inputValue = state.text;


        inputData.value = this.inputValue;

        this.$emit('select', {

          inputData,
        });
      },

      focusField (fieldName) {

        if (fieldName === 'state') {

            this.isStateInFocus = true;

            if (this.error) {

              this.inputValue = '';
            }

        }

        this.isFieldInFocus = true;


      },

      detectInputChange (inputValue) {

         this.inputValue = inputValue;

      },

      sendInputData (inputData) {

          this.isStateInFocus = false;

          this.isFieldInFocus = false;

         this.$emit('fieldBlur', {

          inputData,
        });












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

/****TRANSITIONS****/
.fade-error-enter-active, .fade-error-leave-active {
  transition: all  .7s ease-in-out;

}

.fade-error-enter, .fade-error-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.fade-error-enter-active, .fade-error-leave-active {
  transition: all  .7s ease-in-out;

}

.fade-error-enter, .fade-error-leave-to {
  opacity: 0;
  transform: translateX(100px);
}


.fade-select-enter-active, .fade-select-leave-active {
  transition: all  .7s ease-in-out;

}

.fade-select-enter, .fade-select-leave-to {
  opacity: 0;

}
/****END TRANSITIONS****/

  #focus {
   border: 2px solid lighten($lightBlue, 10);
   transition: all 0.3s ease-in-out;

  }

  .select-state {
      background-color: rgba(0, 0, 0, 0.8);
      color: $lightBlue;
      height: 300px;
      overflow: hidden;
      overflow-y: scroll;
      width: 70%;
      margin: 0 auto;
      text-align: center;
      position: absolute;
      top: 100%;
      left: 17%;

      &::-webkit-scrollbar {
    width: 12px;
}

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
}

&::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    background-color: $lightBlue;
}


      span {
        display: block;
        cursor: pointer;
        transition: all 0.25s ease-in-out;
        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }

      }
  }

</style>