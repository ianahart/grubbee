<template>

    <div @click="changeView(view)" class="change-view-link">
        <img :src="require(`../assets/${fileName}.svg`)" :alt="alt" />
        <p>{{ text }}</p>
    </div>

</template>



<script>
export default {
  name: 'AdminCommentViewChangeBtn',

  props: {
    fileName: String,
    alt: String,
    text: String,
    view: String,
  },

  data () {
    return {
      buttonClicked: false,
    }
  },
  methods: {
    changeView(view) {

      this.$emit('toggleView', {
        view,
      })
    }
  },
}

</script>

<style lang="scss">


</style>