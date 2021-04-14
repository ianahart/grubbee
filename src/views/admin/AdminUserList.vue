<template>
  <div class="admin-user-list">
      <DashBoardBackBtn />
      <AdminUserListHeader />
      <AdminUserListFormSelectors
        @changeselector="updateSelectorClicked"
        :currentActiveForm="currentActiveForm"
      />
       <AdminUserListFilterBox
        @filter="handleNameFilter"
        @clearfilter="clearFilter"
        @resetfilterstate="resetFilterState"
        :nameFilterCleared="nameFilterCleared"
      />
      <AdminUserListDropdown
        @setdropselectionclick="handleDropSelectionClick"
        @setdropselectionenter="handleDropSelectionEnter"
        :dropdownSelection ="dropdownSelection"
        :currentPage="currentPage"

      />
      <AdminUserListFormsContainer
        @updateinputvalue="assignInputValue"
        @updatedoubleinputvalues="assignDoubleInputValues"
        @resetformerrorsingle="resetFormErrorSingle"
        @sendform="handleSubmitForm"
        :forms="forms"
        :currentActiveForm="currentActiveForm"
      />
      <AdminUserListDisplay
        @moreusers="getMoreUsers"
        @updatecurrentpage="updateCurrentPage"
        @changecurrentpagebybtn="handlePagBtnClicked"
        @handleloadmore="handleFormLoader"
        :users="userList"
        :numOfUsers="numOfUsers"
        :numOfPages="numOfPages"
        :currentPage="currentPage"
        :numOfPagesOnScreen="numOfPagesOnScreen"
        :modifiedUsers="modifiedUserList"
        :formTriggered="formTriggered"
      />

  </div>
</template>

<script>


import axios from 'axios';
import { firebase } from '@firebase/app';

import DashBoardBackBtn from '../../components/DashBoardBackBtn';
import AdminUserListHeader from '../../components/AdminUserListHeader';
import AdminUserListFormSelectors from '../../components/AdminUserListFormSelectors';
import AdminUserListFilterBox from '../../components/AdminUserListFilterBox';
import AdminUserListDropdown from '../../components/AdminUserListDropdown';
import AdminUserListFormsContainer from '../../components/AdminUserListFormsContainer';
import AdminUserListDisplay from '../../components/AdminUserListDisplay';


  export default {
    name: 'AdminUserList',

    components: {

      DashBoardBackBtn,
      AdminUserListHeader,
      AdminUserListFormSelectors,
      AdminUserListFilterBox,
      AdminUserListDropdown,
      AdminUserListFormsContainer,
      AdminUserListDisplay,

    },
    data() {

      return {
        numOfPagesOnScreen: [1, 2, 3],
        maxNumOfPages: 0,
        currentPage: 1,
        perPage: 5,
        numOfPages: null,
        numOfUsers: 0,
        offset: 2,
        pagBtn: '',

        nameFilter: '',
        nameFilterCleared: false,

        debounceID: '',
        debounceInterval: 1000,

        currentActiveForm: 'List',
        formTriggered: false,
        lastVisibleOnForm: '',
        serverDataLoaded: false,
        initialUserListData: true,
        dropdownSelection: 'Sort',
        dropdownActive: false,
        userList: [],
        forms: {

          name: {
            marker: 'Name',
            model: '',
            error: '',
          },
          email: {
            marker: 'Email',
            model: '',
            error: '',
          },
          dates: {
            marker: 'Between Dates',
            startModel: '',
            endModel: '',
            error: '',
          },
          activity: {
            marker: 'Active/Inactive',
            model: '',
            error: '',
          }
        },
      }
    },

    async created () {

        this.setCurrentPage();

        if (!Object.keys(this.$route.query).length || this.$route.query.page === '1') {

            await this.getInitialUserList();

        }
    },

    mounted () {
    },


    beforeDestroy() {

      clearTimeout(this.debounceID);
    },



    watch: {


      currentPage: function () {

        this.dropdownSelection = 'Sort';

        this.nameFilterCleared = true;

        if (!this.formTriggered) {
        clearTimeout(this.debounceID);

        this.debounceMoreUsers();

        this.numOfPagesOnScreen.splice(0);

        this.reactToRefresh();
        }


        if (this.currentPage === this.numOfPagesOnScreen[0]) {

          this.goBackPage();
        }
      },

      currentActiveForm: function () {

        this.notCurrentFormClearErrors();
      },

      $route(to) {

        this.currentPage = parseInt(to.query.page);
      },
    },

    computed: {

      modifiedUserList () {

        return this.applyNameFilter();

      }
    },

    methods: {

      clearPagNavigation () {

        window.history.pushState({}, "", this.$route.fullPath.split("?")[0]);

        for (let param in this.$route.query) {

            delete this.$route.query[param];
        }

        this.numOfPagesOnScreen = [ 1, 2, 3];

        this.currentPage = 1;
      },

      sortByDate() {

        let sortedUsers;

        this.dropdownActive = false;

        if (this.dropdownSelection === 'Newest') {

            sortedUsers = this.sortDateAsc();

        return sortedUsers;
        }

        if (this.dropdownSelection === 'Oldest') {

          sortedUsers = this.sortDateDesc();

          return sortedUsers;
        }
      },

      sortDateDesc () {

        let users;

        users = this.userList.sort(
          (userA, userB) => {

          return userA.createdAt._seconds
          >
          userB.createdAt._seconds ? 1
          :
          userB.createdAt._seconds
          >
          userA.createdAt._seconds ? -1 : 0;

        });
       return users;
      },


      sortDateAsc () {
        let users;

        users = this.userList.sort(
          (userA, userB,) => {

            return userA.createdAt._seconds
            <
            userB.createdAt._seconds ? 1
            :
            userB.createdAt._seconds
            <
             userA.createdAt._seconds ? -1 : 0;
           }
        );
      return users;
      },

      handleDropSelectionClick ({ data }) {

       this.setDropdownValues(data);
      },

      handleDropSelectionEnter({ data }) {

        this.setDropdownValues(data);
      },

      setDropdownValues(selection) {

        if (this.dropdownSelection === selection) {

            this.dropdownActive = false;
          } else {

          this.dropdownSelection = selection;

          this.dropdownActive = true;
          }
      },

      setCurrentPage() {

        if (this.$route.query.page) {

          this.currentPage = parseInt(this.$route.query.page);
        } else {
          this.currentPage = 1;
        }

      },


      reactToRefresh () {

        this.$route.query.cur =  decodeURIComponent(this.$route.query.cur);

        this.$route.query.cur.split(' ')
        .forEach(
          (pN) => {

          if (pN === '' || pN === ' ') {

              return;
          } else {

              this.numOfPagesOnScreen.push(parseInt(pN));
          }
         }
        );
      },

      debounceMoreUsers () {

      this.debounceID =  setTimeout(
          async () => {

          await this.getMoreUsers();
        },
        this.debounceInterval);
      },


    handlePagBtnClicked ({ data }) {

        let { currentPage, action } = data;

        this.pagBtn = action;

        switch(action) {

          case 'next':

            this.handleNextBtn(currentPage, action);
          break;

          case 'previous':
            this.handlePrevBtn(currentPage, action);
          break;

          default:
        }
    },

    handleNextBtn(currentPage, btn) {

      this.$router.push({name: 'AdminUserList', query: {page: this.currentPage + 1, btn, cur: encodeURIComponent(this.numOfPagesOnScreen.join(' '))}}).catch((e) => {console.log(e)});

      if (this.currentPage !== this.numOfPages
      && this.currentPage !== this.numOfPagesOnScreen[this.numOfPagesOnScreen.length - 1]
      ) {

          this.currentPage = this.currentPage + 1;
      } else {


        const start = this.numOfPagesOnScreen[this.numOfPagesOnScreen.length - 1];

        const end = start + this.offset;

        this.adjustACSPages(start, end, btn);

        this.$router.push({name: 'AdminUserList', query: {page: this.currentPage, btn, cur: encodeURIComponent(this.numOfPagesOnScreen.join(' '))}}).catch((e) => {console.log(e)});

      }
    },

      /*
      *   Function adjustACSPages()
      *  Test double digit pages use: this.numOfPages = 10;
      *
      */

      adjustACSPages(start, end) {

        this.numOfPagesOnScreen.splice(0);

        for (let i = start; i <= end; i++) {

          if (i <= this.numOfPages) {

            this.numOfPagesOnScreen.push(i);
          }
        }

        this.currentPage++;
      },

      handlePrevBtn (currentPage, btn) {

        if (this.currentPage !== 1) {

        this.$router.push({name: 'AdminUserList', query: {page: this.currentPage - 1, btn, cur: encodeURIComponent(this.numOfPagesOnScreen.join(' '))}}).catch((e) => {console.log(e)});

        }

        this.currentPage = currentPage - 1;


        this.goBackPage(btn);
      },

      goBackPage(btn) {

          if (this.currentPage === this.numOfPagesOnScreen[0]) {

            let start;

            start = this.currentPage - this.offset;

            const end = this.currentPage;


            if (this.currentPage === 1) {

              return;
            } else {

              this.adjustDESCPages(start, end)

              this.$router.push({name: 'AdminUserList', query: {page: this.currentPage, btn, cur: encodeURIComponent(this.numOfPagesOnScreen.join(' '))}}).catch((e) => {console.log(e)});

            }
         }
      },

      adjustDESCPages(start, end) {

        this.numOfPagesOnScreen.splice(0);

        for (let i = start; i <= end; i++) {

          this.numOfPagesOnScreen.push(i);
        }

      },

      flushList () {

        this.userList.splice(0);
      },

      updateCurrentPage({ data }) {

        this.currentPage = parseInt(data);
      },

      setRadioChange({ data }) {

        this.radioBtnSelected = data;
      },

      resetFormErrorSingle ({ data }) {

        for (let form in this.forms) {

          if (this.forms[form]['marker'] === data) {

            this.forms[form]['error'] = '';
          }
        }
      },

      handleNameFilter ({ filterValue }) {

        this.nameFilter = filterValue;
      },

      applyNameFilter() {

        if (this.dropdownSelection !== 'Sort') {

            this.sortByDate();
        }

        const users = this.userList
        .filter(
          (user) => {

            return user
            .firstName
            .includes(this.nameFilter.toLowerCase())
            || user
            .lastName
            .includes(this.nameFilter.toLowerCase());
          }
        );

        return users;
      },

      resetFilterState() {

        this.nameFilterCleared = false

        this.nameFilter = '';
      },

      clearFilter() {

        this.nameFilterCleared = true;

        this.nameFilter = '';
      },

      async updateSelectorClicked ({ data }) {

          this.initialUserListData = false;

            // returns pagination to beginning
          if (data === 'Default' || data === 'List') {

            this.currentActiveForm = 'List';

            this.nameFilter = '';

            this.nameFilterCleared = true;

            this.dropdownSelection = 'Sort';

            await this.getInitialUserList();

            this.formTriggered = false;

            this.initialUserListData = true;
          } else {

            this.currentActiveForm = data;
          }
      },


      getSingleInputForms () {

        const modifiedForms = Object
        .entries(this.forms)
        .map(
          (form) => {

            return form[1];
        }
        )
        .filter(
          (form) => {

          return form.marker !== 'Between Dates';
          }
        );

        return modifiedForms;

      },

      assignInputValue ({ data }) {

       let formToUpdate;

       const { formName, inputValue } = data.data;

       const singleInputForms = this.getSingleInputForms();

       for (let form in singleInputForms) {

          for (let property in singleInputForms[form]) {

            if (property === 'marker') {

              if (singleInputForms[form][property] === formName) {

                    formToUpdate = singleInputForms[form];
              }
            }
          }
        }

        if (formToUpdate.marker !== 'Between Dates') {

            formToUpdate.model = inputValue;
        }

        this.assignError(formToUpdate, 'single');
      },


      assignError (form, input) {

        if (input === 'single') {

          if (form.model.trim().length === 0) {

              form.error = `${form.marker} field cannot be empty`;
          }
        }

        if (input === 'double') {

          if (form.startModel.trim().length === 0 || form.endModel.trim().length === 0) {

            form.error = `Please make sure to fill out both fields in ${form.marker}`;
          }
        }
      },

      notCurrentFormClearErrors () {

        for (let form in this.forms) {

          if (this.currentActiveForm !== this.forms[form]['marker']) {

              this.forms[form]['error'] = '';

              if (this.forms[form]['marker'] !== 'Between Dates') {

                  this.forms[form]['model'] = '';
              } else {

                this.forms[form]['startModel'] = '';

                this.forms[form]['endModel'] = '';
              }
          }
        }
      },

      assignDoubleInputValues ({ data }) {

        const { startModel, endModel } = data;

       let formToUpdate;

        for (let form in this.forms) {

          if (form === 'dates') {

             formToUpdate =  this.forms[form];
          }
        }

        formToUpdate['startModel'] = startModel;

        formToUpdate['endModel'] = endModel;

        this.assignError(formToUpdate, 'double');
      },

      checkErrorsOnSubmit (formData) {

        if (formData.error.length) {

          return false;
        } else {

          return true;
        }
      },

      checkInputsOnSubmit (formData) {

        for (let form in this.forms) {

            if (this.forms[form]['marker'] === formData['marker']) {

              if (formData['marker'] !== 'Between Dates') {

                this.assignError(this.forms[form], 'single');
              } else {

                this.assignError(this.forms[form], 'double');
              }
            }
        }
      },

      async sendFirebaseRequest(data, method, url) {

        let response;

          const idToken = await firebase
          .auth()
          .currentUser
          .getIdToken(true);

        try {

          response = await axios(
            {
              headers: {

                'Content-Type': 'application/json',
                'Accept': 'application/json',
                 Authorization: `Bearer ${idToken}`
              },
              method,
              url,
              data: method === 'POST' ? data : '',
            }
          );

         return response;

        } catch (e) {

          console.log('Exeception: ', e);

          console.log('Exception Message: ', e.message);

          return e.response;
        }
      },
     async handleSubmitForm ({ data }) {

        try {

          this.checkInputsOnSubmit(data);

          const validated = this.checkErrorsOnSubmit(data);

          if (!validated) {

            return;
          } else {


            const FIREBASE_URL = process.env.VUE_APP_SEND_ADMIN_USER_LIST;

            const requestData = {

              form: data,

              request: {
              status:  'initial',
            }
            };

            const method = 'POST';

            const responseData = await this.sendFirebaseRequest(requestData, method, FIREBASE_URL);

            if (responseData.status === 200) {

              this.flushList();

              const { result, totalUsers } = responseData.data.body.data;

              this.numOfUsers = totalUsers;

              this.userList.push(...result);

              this.lastVisibleOnForm = this.userList[this.userList.length - 1];

              this.formTriggered = true;


              this.clearPagNavigation();

            } else {

              this.handleResponse(responseData);
            }
          }

        } catch (e) {

          console.log('Exception: ', e);

          console.log('Exception Message: ', e.message);
        }
      },

      handleResponse (response) {

        if (response.status === 400) {

          const { error, marker } = response.data.body;

          for (let form in this.forms) {

            if (this.forms[form]['marker'] === marker) {

              this.forms[form]['error'] = error;
            }
          }
        }
      },

      async getInitialUserList () {

        let responseData;

        try {


          const method = 'GET';

          const requestData = {};

          const FIREBASE_URL = process.env.VUE_APP_INITIAL_USER_LIST;

          responseData = await this.sendFirebaseRequest(requestData, method,FIREBASE_URL);

          const { data } = responseData.data.body;

          this.userList = data;

          this.numOfUsers = responseData.data.body.numOfUsers;

          this.calculateNumOfPages();

        } catch (e) {

          console.log('Exeception Response: ', e.response);

          console.log('Exception: ', e);

          console.log('Exception Message: ', e.message);
        }
      },


      calculateNumOfPages() {


        this.numOfPages = Math.ceil(this.numOfUsers/ this.perPage);

      },

      async getMoreUsers () {

            let responseData

        try {

              const startPos = this.currentPage * this.perPage - this.perPage;

              const method = 'POST';

              const url = process.env.VUE_APP_GET_MORE_USERS;

              const requestData = {

                startPos,
              }

              this.flushList();

              responseData = await this.sendFirebaseRequest(requestData, method, url);

              const { data, numOfUsers } = responseData.data.body;

              this.numOfUsers = numOfUsers;

              this.userList.push(...data);

              this.calculateNumOfPages();

        } catch (e) {

          console.log('Exeception Response: ', e.response);

          console.log('Exception: ', e);

          console.log('Exception Message: ', e.message);
        }
      },

      async handleFormLoader () {

        let responseData;

        try {

          const form = this.getCurrentFormData();

          const method = 'POST';

          const FIREBASE_URL = process.env.VUE_APP_LOAD_MORE_FORM_RESULTS;

          const requestData = {
            form,
            request: {
              status: 'non-initial',
              lastVisibleOnForm: this.lastVisibleOnForm,
            }
          };

          responseData = await this.sendFirebaseRequest(requestData, method, FIREBASE_URL);


              const { result ,totalUsers } = responseData.data.body.data;


              this.numOfUsers = totalUsers;

              this.userList.push(...result);

              this.lastVisibleOnForm = this.userList[this.userList.length - 1];

              this.formTriggered = true;

        } catch (e) {

          console.log('Exception: ', e);

          console.log('Exception Message: ', e.message);
        }
      },

       getCurrentFormData() {

          let activeFormData;

         for (let form in this.forms) {

           if ( this.forms[form]['marker'] === this.currentActiveForm) {

               activeFormData = this.forms[form];
           }
         }
         return activeFormData;
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

.admin-user-list {
  background-color: lighten(#f5f5f5, 2);
  height: 100%;
  width: 100%;
}

</style>