<template>

      <div
        @mouseover="revealToolTip"
        @mouseleave="concealToolTip"
        :class="compClass"
      >
        <transition name="fade-tooltip">
          <AdminToolTip
            v-if="toolTipPosition === 'left' && isToolTipShowing"
            :toolTipText="toolTipText"
            :toolTipPosition="toolTipPosition"
          />
        </transition>
        <i :class="icon"></i>
        <h3>{{ field }}</h3>
        <transition name="fade-tooltip">
          <AdminToolTip
            v-if="toolTipPosition === 'right' && isToolTipShowing"
            :toolTipText="toolTipText"
            :toolTipPosition="toolTipPosition"
          />
        </transition>
      </div>
</template>


<script>
  import AdminToolTip from './AdminToolTip';

  export default {
    name: 'AdminCommentField',
    components: {
      AdminToolTip,
    },

    props: {
      icon: String,
      field: String,
      toolTipText: String,
      toolTipPosition: String,
      compClass: String,

    },

    data () {
      return {
        isToolTipShowing: false,
      }
    },

    methods: {

        revealToolTip() {

          this.isToolTipShowing = true;
        },

        concealToolTip () {

          this.isToolTipShowing = false;
        }
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

//****TRANSITIONS****/
.fade-tooltip-enter-active, .fade-tooltip-leave-active {
  transition: all .75s ease-in-out;

}

.fade-tooltip-enter, .fade-tooltip-leave-to {
  opacity: 0;
  transform: translateY(100px);

}



//****END TRANSITIONS****/

</style>