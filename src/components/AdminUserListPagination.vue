<template>
  <div class="admin-user-list-pagination">
    <button
      v-if="prevBtnActive"
      @click="handlePagBtns('previous')"
    >
      Prev
    </button>
    <div v-if=" 1 !== currentPage" class="trailing-dots">. . .</div>
    <AdminUserListPaginationPage
      @sendnext="handleSendNext"
      :numOfPagesOnScreen="numOfPagesOnScreen"
      v-for="page in numOfPagesOnScreen" :key="page === 0 ? page + 1 : page"
        :page="page"
        :currentPage="currentPage"
    />
    <div v-if="numOfPages !== currentPage" class="trailing-dots">. . .</div>
    <button
     v-if="nextBtnActive"
     @click="handlePagBtns('next')"
    >
      Next
    </button>
  </div>
</template>

<script>

  import AdminUserListPaginationPage from './AdminUserListPaginationPage';

  export default {

    name: 'AdminUserListPagination',

    props: {
      numOfUsers: Number,
      numOfPages: Number,
      currentPage: Number,
      numOfPagesOnScreen: Array,
    },

    components: {

      AdminUserListPaginationPage,
    },

    data () {
      return {

        prevBtnActive: true,

        nextBtnActive: true,
      }
    },

    created () {

    },

    mounted () {

      this.shouldShowPrevBtn();

      this.setButtons();
    },

    watch: {

      currentPage: function () {

        this.setButtons();

      },
    },

    methods: {

      setButtons() {

        this.prevBtnActive = this.currentPage !== 1 ? true : false;

        this.nextBtnActive = this.currentPage !== this.numOfPages ? true : false;
      },

      shouldShowPrevBtn() {

        this.prevBtnActive = this.currentPage === 1 ? false : true;

      },

      sendEvent (event, data) {

        if (Object.keys(data).length >= 2) {

        this.$emit(event,data);
        } else {

        this.$emit(event,
            {
              data,
            }
          );
        }

      },

      handleSendNext({ data }) {

        this.sendEvent('sendcurrentpage', data);
      },

      handlePagBtns (button) {


      this.sendEvent('pagbtnclicked',
        {
          currentPage: this.currentPage,
          action: button
        }
      );
      },
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

.admin-user-list-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;

    button {
    border: none;
    background-color: darken($gray, 10);
    width: 50px;
    height: 20px;
    border-radius: 0.25rem;
    color: $black;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: $gray;
    }
  }
}

.trailing-dots {

  margin: 0 1rem;

}

</style>