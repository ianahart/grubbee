<template>
      <div :class="styles">
        <label>
         {{  label }}
        </label>
        <input
          @focus="handleCurrentField(inputField)"
          @keyup="handleInputChange({name: inputField, value: inputValue})"
          :type="inputType"
          v-model="inputValue"
        />
        <AddRestaurantFieldError
           v-if="error"
          :formFieldError="error"
        />
      </div>
</template>


<script>
import AddRestaurantFieldError from './AddRestaurantFieldError';
  export default {

    name: 'AddRestaurantFormField',

    components: {
      AddRestaurantFieldError,
    },

    props: {
      styles: String,
      label: String,
      inputType: String,
      vModel: String,
      error: String,
      inputField: String,
    },

    data () {

      return {
        inputValue: '',
      }
    },

    created () {

    },

    mounted () {

    },

    methods: {
        handleInputChange(input) {

          this.$emit('change', {

            input,
          });
        },

        handleCurrentField (name) {

          this.$emit('current', {

            name,
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

</style>