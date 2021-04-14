<template>
  <div class="admin-comment-pagination">
    <div class="pagination-btns">
      <AdminCommentPagBtn
        v-if="!isFirstPage"
       @paginate="sendSortOrder"
       text="Newer"
       fileName="arrow-left"
       className="newer-pag-btn"
       action="prev"
       />
      <AdminCommentPagBtn
        v-if="!isLastPage"
        @paginate="sendSortOrder"
        text="Older"
        fileName="arrow-right"
        className="older-pag-btn"
        action="next"
      />
    </div>
  </div>
</template>


<script>
import AdminCommentPagBtn from './AdminCommentPagBtn';
export default {
  name: 'AdminCommentPagination',
  components: {
    AdminCommentPagBtn,
  },
  props: {
    isLastPage: Boolean,
    isFirstPage: Boolean
  },

  data() {
    return {

    }
  },

  methods: {
    sendSortOrder({ sortOrder }) {

        this.$emit('sort', {
          sortOrder
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

.pagination-btns {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 0.5rem;
}




</style>