<template>
  <td>
    <input @change="sendCheckboxState(payment)" type="checkbox" v-model="checkbox" />
  </td>
</template>

<script>

export default {

  name: 'AdminPaymentCheckbox',

  props: {
    payment: Object,
    selectedWasReset: Boolean,

  },

  components: {

  },

  data () {

    return {

      checkbox: false,
    }
  },

  created () {

  },

  mounted () {

  },

  watch: {

    selectedWasReset: function () {

           this.checkbox = false;

    },


  },

  methods: {

    sendCheckboxState (payment) {

      const checkbox = this.checkbox;

      this.$emit('checkboxtoggle',
        {
          checkbox,
          payment
        }
      );
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
</style>