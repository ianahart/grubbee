<template>

  <div class="admin-userlist-loader-container">
    <button @click="sendLoadMoreEvent">{{ btnText }}</button>
  </div>
</template>

<script>

export default {

  name: 'AdminUserListFormLoader',

  props: {

    btnText: String,
  },

  components: {

  },

  data () {
    return {

    }
  },

  created () {

  },

  mounted () {

  },

  methods: {

    sendLoadMoreEvent() {

      this.$emit('sendloadmorevent',{


      });
    },
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

.admin-userlist-loader-container {

  display: flex;
  justify-content: center;
  margin: 4rem 0;

  button {
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    border-radius: 0.25rem;
    width: 130px;
    height: 35px;
    border: none;
    background-color: $blue;
    color: $offwhite;
    letter-spacing: .5px;
    &:hover {
      background-color: lighten($blue, 7);
    }
  }

}

</style>