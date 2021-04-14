<template>

  <router-link
    :class="`admin-user-list-pagination-page ${active}`"
    :to="{name: 'AdminUserList', query: {page: page, cur: encodeURIComponent(this.numOfPagesOnScreen.join(' '))}}">
    {{ page }}
  </router-link>

</template>


<script>

export default {

  name: 'AminUserListPaginationPage',

  props: {
    page: Number,
    currentPage: Number,
    numOfPagesOnScreen: Array,
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

  computed: {

    active () {

        return this.page  === this.currentPage ? 'highlight-current-page' : '';
    }
  },

  methods: {

    sendEvent(event ,data) {

      this.$emit(event,
        {
          data,
        }
      );
    },

    sendPage(page) {

      this.sendEvent('sendnext', page);
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

.admin-user-list-pagination-page {

  cursor: pointer;
  color: lighten($black, 10);
  padding: 0.4rem;
}

.highlight-current-page {
  font-size:1.1rem;
  text-decoration: underline;
  color:$lightBlue;
}

</style>