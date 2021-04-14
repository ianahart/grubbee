<template>
  <div v-if="usersLoaded" class="admin-user-list-display">
    <AdminUserListTableLegend />
    <table class="admin-user-list-table">
      <tr>
        <th>&nbsp;</th>
        <th>id:</th>
        <th>First Name:</th>
        <th>Last Name:</th>
        <th>Email:</th>
        <th>Restaurant:</th>
        <th>Restaurant Name:</th>
        <th>Last Login:</th>
        <th>Reviews:</th>
        <th>Account Created:</th>
     </tr>
     <AdminUserListTableRow
        @selectedrow="handleSelectedRow"
        v-for="user in modifiedUsers" :key="user.id"
        :user="user"
        :currentRow="currentRow"
     />
    </table>
      <AdminUserListPagination
        v-if="!formTriggered"
        @pagbtnclicked="sendPagBtnAction"
        @sendcurrentpage="sendCurrentPage"
        :numOfUsers="numOfUsers"
        :numOfPages="numOfPages"
        :currentPage="currentPage"
        :numOfPagesOnScreen="numOfPagesOnScreen"
      />
      <AdminUserListFormLoader
        v-if="formTriggered && users.length < numOfUsers"
        btnText="Load More..."
        @sendloadmorevent="emitLoadEvent"
      />
  </div>
</template>
<script>

import AdminUserListTableLegend from './AdminUserListTableLegend';
import AdminUserListTableRow from './AdminUserListTableRow';
import AdminUserListPagination from './AdminUserListPagination';
import AdminUserListFormLoader from './AdminUserListFormLoader';


/**CLEAR QUERY STRING:**/
//    window.history.pushState("happy", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);


  export default {

    name: 'AdminUserListDisplay',

    props: {
      users: Array,
      modifiedUsers: Array,
      numOfUsers: Number,
      numOfPages: Number,
      currentPage: Number,
      numOfPagesOnScreen: Array,
      formTriggered: Boolean,
    },

    components: {

      AdminUserListTableLegend,
      AdminUserListTableRow,
      AdminUserListPagination,
      AdminUserListFormLoader,
    },

    data () {

      return {

        usersLoaded: false,
        currentRow: '',
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

       users: function () {

         this.usersLoaded = true;
       }
    },


    methods: {

        handleSelectedRow({ data }) {

          this.currentRow = data;
        },


      sendEvent(event, data = '') {

        this.$emit(event,
          {
            data
          }
        );
      },

      emitLoadEvent() {

        this.sendEvent('handleloadmore', {});
      },

      sendCurrentPage ({ data }) {

        this.sendEvent('updatecurrentpage', data);
      },

      sendMoreUsers() {

        this.sendEvent('moreusers');
      },

      sendPagBtnAction (data) {

        this.sendEvent('changecurrentpagebybtn', data);
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


@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

.admin-user-list-display {
  width: 95%;
  border-top: 2px solid lighten($gray, 2);
  margin: 2rem auto;
  overflow-x:auto;
  padding: 1rem;
  background-color: #fff;
}

.admin-user-list-table {

    width: 95%;
    margin: 0 auto;
    border-collapse: collapse;

    tr {

      th {
        font-weight: 900;
        font-family: 'Open Sans', sans-serif;
        text-align: left;
        margin-left: 0.5rem;
        padding: 0 0.5rem;
      }
    }
}


@media (max-width: 600px) {

  .admin-user-list-display {

    padding: 0;
  }
}
</style>

