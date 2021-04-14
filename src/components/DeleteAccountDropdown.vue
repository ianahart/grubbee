
<template>
  <div class="delete-account-dropdown">
    <h3>Why are you deleting your account?</h3>
    <div class="delete-account-reasons">
      <select v-model="selectedOptionText" @change="setSelected">
        <option
          v-for="(option, index) in options"
          :key="option.value"
          :disabled="index === 0"
        >
          {{ option.text }}
        </option>
      </select>
      <input
        @blur="setCustomSelected"
        v-model="customSelectedOptionText"
        v-if="selectedOption.value === 'custom'"
        placeholder="Something else..."
      />
    </div>
  </div>
</template>

<script>

  export default {

      name: 'DeleteAccountDropdown',

      props: {
        options: Array,
      },

      components: {

      },

      data () {

        return {
          selectedOptionText: '',
          selectedOption: '',
          customSelectedOptionText: '',
        }
      },

      created () {

      },

      mounted () {

        this.selectedOptionText = this.options[0].text;
      },

      methods: {

        setSelected () {

          this.selectedOption = this.options.find((option) => option.text === this.selectedOptionText);

          if (this.selectedOption.value !== 'custom') {

             this.$emit('triggerchange', this.selectedOptionText);
          }
        },

        setCustomSelected () {

          this.$emit('triggercustom', this.customSelectedOptionText);
        },
      },
  }



</script>

<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.delete-account-dropdown {
  display: flex;
  // align-items: center;
  justify-content: space-between;
  margin-top: 3rem;

  h3 {
    font-size: 1rem;
  }

}

.delete-account-reasons {
  display: flex;
  flex-direction: column;

  select {
    margin-bottom: 3rem;
    height: 35px;
    background-color: lighten($blue, 7);
    border-radius: 0.25rem;
    color: $offwhite;

  }

  input {
    height: 35px;
    border-radius: 0.25rem;
    border: none;
    border: 1px solid lighten($blue, 7);
    background-color: transparent;
  }
}


@media (max-width: 600px) {
  .delete-account-dropdown {
    flex-direction: column;
    align-items: center;

    h3 {
      margin-bottom: 1.5rem;
    }
  }
}



</style>




