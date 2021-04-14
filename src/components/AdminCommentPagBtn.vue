<template>
  <div>
    <div
      @mouseover="showActive"
      @mouseleave="hideActive"
      @click="sendSortAction($event, action)"
      :class="`admin-comment-pag-btn ${className}`"
      >
      <img :src="require(`../assets/${fileName}.svg`)" alt="arrow" />
      <p :class="`${isActive ? 'pag-active-text' : ''}`"

      >{{ text }}</p>
    </div>
    <transition name="slide-active">
      <div v-if="isActive" class="pag-btn-underline"></div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'AddCommentPagBtn',
  props: {
    text: String,
    fileName: String,
    className: String,
    action: String,
  },

  data() {
    return {
      isActive: false,
    }
  },

  methods: {
    showActive() {

      this.isActive = true;
    },

    hideActive() {

      this.isActive = false;
    },

    sendSortAction(event, sortOrder) {

      this.$emit('paginate', {
        sortOrder,
      });
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

/****TRANSITIONS****/
.slide-active-enter-active, .slide-active-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-active-enter, .slide-active-leave {
  opacity: 0;
  transform: translate(-100px);
}

/****END TRANSITIONS****/

.pagination-btns {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 0.5rem;
}

.admin-comment-pag-btn{
  display: flex;
  cursor: pointer;
  color: $black;

  p {
    margin:0;
    transition: all 0.5s ease-in-out;
  }
}

.pag-active-text {
  font-weight: 900;
}

.pag-btn-underline {
  height: 2px;
  background-color: $black;
  width: 100%;
}


.older-pag-btn {
  flex-direction: row-reverse;
}


</style>