<template>
  <div v-if="Object.entries(forms).length"  class="admin-user-list-forms-container">
    <AdminUserListForm
      v-if="currentActiveForm === 'Name'"
      label="Name of user:"
      :currentActiveForm="currentActiveForm"
      faIcon="fas fa-id-badge"
      @sendup="handleInputSend"
      :form="forms.name"
      @sendresetformerror="handleResetFormErrorSingle"
      @sendsubmitup="sendForm"
    />
     <AdminUserListForm
      v-if="currentActiveForm === 'Email'"
      label="User Email Address:"
      :currentActiveForm="currentActiveForm"
      faIcon="fas fa-envelope-square"
      @sendup="handleInputSend"
      :form="forms.email"
      @sendresetformerror="handleResetFormErrorSingle"
      @sendsubmitup="sendForm"
    />
    <!-- THIS IS ONLY DIFFERENT FORM  -->
     <AdminUserListForm
      v-if="currentActiveForm === 'Between Dates'"
      label="Interval (account created) :"
      :currentActiveForm="currentActiveForm"
      faIcon="fas fa-calendar-day"
      @sendinputsup="handleDoubleInputSend"
      @sendresetformerror="handleResetFormErrorSingle"
      :form="forms.dates"
      @sendsubmitup="sendForm"

    />
     <AdminUserListForm
      v-if="currentActiveForm === 'Active/Inactive'"
      label="Active/Inactive:"
      :currentActiveForm="currentActiveForm"
      faIcon="fas fa-toggle-on"
      @sendup="handleInputSend"
      :form="forms.activity"
      @sendresetformerror="handleResetFormErrorSingle"
      @sendsubmitup="sendForm"
    />
  </div>
</template>

<script>

  import AdminUserListForm from './AdminUserListForm';

  export default {

    name: 'AdminUserListFormsContainer',

    components: {

      AdminUserListForm,
    },

    props: {

      currentActiveForm: String,
      forms: Object,
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

      sendEvent(event, data) {

        this.$emit(event,
          {
              data
          }
        );
      },

      handleInputSend ({ data }) {

        this.sendEvent('updateinputvalue',
          {
            data,
          }
        );
      },

      handleDoubleInputSend ({ data }) {

        this.sendEvent('updatedoubleinputvalues', data);
      },

      handleResetFormErrorSingle ({ data }) {

        this.sendEvent('resetformerrorsingle', data);
      },

      sendForm ({ data }) {

          this.sendEvent('sendform', data);
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

.admin-user-list-forms-container {

  margin: 1.5rem 0;
}


</style>