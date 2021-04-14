<template>
  <div class="admin-tooltip">
    <p :class="styles">{{ toolTipText }}</p>
  </div>
</template>



<script>
  export default {
    name: 'AdminToolTip',
    props: {
      toolTipText: String,
      toolTipPosition: String,
    },

    data() {
      return {

      }
    },

    computed: {
      styles: function () {

        return {

        'admin-tooltip-text-left':  this.toolTipPosition === 'right',

        'admin-tooltip-text-right': this.toolTipPosition === 'left',
        }
      }
    },

    methods: {

    }
  }

</script>




<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

.admin-tooltip {
  padding-top: 0.5rem;
  display: flex;
  align-items: flex-start;
  height: 60px;


}

.admin-tooltip-text-left {
  margin: 0;
  position: relative;
  background-color: $gray;
  padding: 0.2rem 0.5rem;
  margin-left: 0.5rem;
  color: $blue;
  font-size: 0.9rem;
  &::after {
     content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -45%;
  border-width: 5px;
  border-style: solid;
  border-color: $gray transparent transparent transparent;
  }
}

.admin-tooltip-text-right {
  margin: 0;
  position: relative;
  background-color: $gray;
  color: $blue;
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.9rem;

  &::after {
     content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: 37%;
  border-width: 5px;
  border-style: solid;
  border-color: $gray transparent transparent transparent;
  }
}
</style>