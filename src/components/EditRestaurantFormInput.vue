<template>
  <div :style=" isInputOpen ? 'marginBottom: 7rem' : ''" class="edit-restaurant-form-input-container">
    <div :style=" dbName === 'firstName' ? 'marginTop: 0rem': ''" @click.self="toggleInput()" :class="`edit-restaurant-form-title ${dynamicBorder}`">
      <h3>
        <i v-if="!isInputOpen" class="fas fa-pen"></i>
        <i v-else class="fas fa-minus"></i>
        <span class="edit-restaurant-error-marker" v-if="inputError">*</span>
        {{ inputTitle }}
      </h3>
        <transition name="toggle-input">
          <div  class="edit-restaurant-input-group" v-if="isInputOpen">
            <i class="fas fa-long-arrow-alt-right"></i>
            <input @blur="handleInputFocus({objName, dbName, inputModel: currentInputValue})" class="edit-restaurant-input" :type="inputType" v-model="currentInputValue">
          </div>
        </transition>
        <p class="edit-restaurant-input-error" v-if="inputError && isInputOpen">{{ inputError }}</p>
    </div>
  </div>
</template>



<script>
// import axios from 'axios';
  export default {

    name: 'EditRestaurantFormInput',

    props: {
      inputModel: String,
      inputType: String,
      inputError: String,
      inputTitle: String,
      dbName: String,
      objName: String,
    },

    components: {

    },

    data () {

      return {
        currentInputValue: '',
        isInputOpen: false,
      }
    },

    created () {

      this.currentInputValue = this.inputModel;
    },

    mounted () {


    },

    computed: {
      expandTitle: function () {

        return  this.isInputOpen ? 'expand-title' : '';
      },

      dynamicBorder: function () {

         return this.inputError.length > 0 ? 'border-error' : 'border-no-error';
      }
    },
    methods: {

      toggleInput () {
        this.isInputOpen = !this.isInputOpen;
      },

      handleInputFocus (inputChange) {


         this.$emit('update', {

           inputChange
         });

         this.isInputOpen = false;
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

/****TRANSITIONS****/

.toggle-input-enter-active, .toggle-input-leave-active {
  transition: all  .7s ease-in-out;

}

.toggle-input-enter, .toggle-input-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}



/****END TRANSITIONS****/

.border-error {
  border: 1px solid red;
}

.border-no-error {
  border: 1px solid $gray;
}

.edit-restaurant-form-input-container {
  width: 100%;
  height: 60px;
  margin-bottom: 3rem;
}

.edit-restaurant-input-group {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 100%;

  i {
    padding-right: 0.5rem;
    color: $lightBlue;
    font-size: 1.4rem;
  }
}

.edit-restaurant-error-marker {
    font-size:2rem;
    color: $red;
    margin: 0 0.3rem;
}

.edit-restaurant-input {
     box-sizing: border-box;
     width: 100%;
     border: 1px solid $gray;
     border-radius: 7px;
     vertical-align: baseline;
     height: 100%;
}

.edit-restaurant-input-error {
  text-align: center;
  color: $red;
  font-weight: bold;
  font-size: 0.8rem;
}

.edit-restaurant-form-title {
  box-sizing: border-box;
  border-radius: 7px;
  margin: 4rem 0;
  padding: 0;
  height: 60px;
  background-color: lighten($gray, 5);
  cursor: pointer;


  h3 {
    margin-bottom: 0.1rem;
    margin-top: 0;
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 0.3rem;
    pointer-events: none;

    i {
      padding: 0 0.3rem;
      color: $lightBlue;
    }
  }
}

</style>