<template>
  <div ref="menuItem">
    <transition name="fade-item">
      <div v-if="isInViewPort">
      <h3>{{ item.menu_item_name }}</h3>
      <p v-if="item.menu_item_description">{{ item.menu_item_description }}</p>
      <p v-if="!item.menu_item_description">N/A</p>
      <div class="menu-item-price">
        <div class="menu-price-underline"></div>
        <p v-if="item.menu_item_pricing.length"><span>.............{{ item.menu_item_pricing[0].price }}</span> {{ item.menu_item_pricing[0].currency }}</p>
        <p v-if="!item.menu_item_pricing.length">N/A</p>
      </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    item: Object,
  },

  data() {
    return {
      isInViewPort: false,
    }
  },

  created() {

      window.addEventListener('scroll', this.handleScroll);
  },

    destroyed() {

    window.removeEventListener('scroll', this.handleScroll);
  },


  methods: {

      handleScroll() {
       const distance = this.$refs.menuItem.getBoundingClientRect();

      if (distance.top >= 0 && distance.bottom <= window.innerHeight) {
          this.isInViewPort = true;
      }
    },
  }
}
</script>

<style lang="scss">
.fade-item-enter-active, .fade-item-leave-active {

  transition: all 1s;
}

.fade-item-enter, .fade-item-leave-to {
  opacity: 0;
  transform: translate(-200px);
}



</style>