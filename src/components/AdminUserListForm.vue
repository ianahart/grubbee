<template>
  <div class="admin-user-list-form">
    <h3>Display user information accordingly</h3>
    <i class="form-icon" :class="faIcon"></i>
    <AdminUserListFormInputSingle
      v-if="currentActiveForm !== 'Between Dates'"
      :label="label"
      :currentActiveForm="currentActiveForm"
      :vModel="currentInput"
      @sendinput="groupInputSingle"
      :error="form.error"
      @singleinputerror="handleSingleInputError"
    />
    <AdminUserListFormInputDouble
      v-if="currentActiveForm === 'Between Dates'"
      :label="label"
      :currentActiveForm="currentActiveForm"
      :vModel="currentInput"
      :error="form.error"
      @singleinputerror="handleSingleInputError"
      @senddoubleinput="groupInputDouble"
    />
    <button
      class="user-list-form-submit-btn"
      @click="sendSubmitUp(form)"
      >
      <i class="fas fa-search"></i>
      Search
    </button>
  </div>
</template>



<script>

  import AdminUserListFormInputSingle from './AdminUserListFormInputSingle';
  import AdminUserListFormInputDouble from './AdminUserListFormInputDouble';

  export default {

    name: 'AdminUserListForm',

    components: {

      AdminUserListFormInputSingle,
      AdminUserListFormInputDouble,

    },

    props: {
      label: String,
      currentActiveForm: String,
      faIcon: String,
      form: Object,
    },

    data () {

      return {

        currentInput: '',
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
              data,
          }
        );
      },

      groupInputSingle ({ data }) {

        this.sendEvent('sendup',
          {
            formName: this.currentActiveForm,
            inputValue: data
          }
        )
      },

      groupInputDouble ({ data }) {

        this.sendEvent('sendinputsup', data);
      },

      handleSingleInputError ({ data }) {

        this.sendEvent('sendresetformerror', data);
      },

      sendSubmitUp(form) {

        this.sendEvent('sendsubmitup', form);
      }
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

.admin-user-list-form {
  padding: 0.5rem;
  margin-left: 2rem;
  width: 50%;
  max-width: 550px;
}

.form-icon {
  color: $lightBlue;
  font-size: 2rem;
}

.user-list-form-submit-btn {
  margin-top: 2rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  width: 120px;
  height: 30px;
  border-radius: 0.25rem;
  border: none;
  background-color: $blue;
  color: $gray;

  &:hover {
    background-color: lighten($blue, 10);
  }
}

@media(max-width: 600px) {
  .admin-user-list-form {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-left: 0;
    text-align: center;
    width: 95%;
  }
}

</style>