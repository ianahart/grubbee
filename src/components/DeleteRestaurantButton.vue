<template>
  <div class="delete-restaurant-button-container">
    <button class="delete-restaurant-button" @click="openModal(true)">Delete Restaurant</button>
  </div>
</template>

<script>


export default {
  name: 'DeleteRestauranButton',

  props: {

  },

  components: {

  },

  data () {

    return {

    }
  },

  mounted() {

  },

  methods: {

    openModal(bool) {

      this.$emit('openModal',
        {
          bool,
        }
      );
    }
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

.delete-restaurant-button {
  height: 30px;
  transition: all 0.5s ease-in-out;
  background-color: $red;
  border: none;
  border-radius: 7px;
  padding: 0.2rem 0.5rem;
  width: 140px;
  color: $gray;
  cursor: pointer;

  &:hover {
    background-color: lighten($red,7);
  }

}

</style>