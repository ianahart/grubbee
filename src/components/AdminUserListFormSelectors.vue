<template>
  <div class="admin-user-list-form-selectors">
    <div class="main-form-selectors">
        <AdminUserListFormSelectorBtn
          btnName="List"
          @selectorclick="emitClick"
          @selectorenter="emitEnter"
          :currentActiveForm="currentActiveForm"
      />
      <AdminUserListFormSelectorBtn
        btnName="Name"
        @selectorclick="emitClick"
        @selectorenter="emitEnter"
        :currentActiveForm="currentActiveForm"
      />
      <AdminUserListFormSelectorBtn
        btnName="Email"
        @selectorclick="emitClick"
        @selectorenter="emitEnter"
        :currentActiveForm="currentActiveForm"
      />
      <AdminUserListFormSelectorBtn
        btnName="Between Dates"
        @selectorclick="emitClick"
        @selectorenter="emitEnter"
        :currentActiveForm="currentActiveForm"
      />
      <AdminUserListFormSelectorBtn
        btnName="Active/Inactive"
        @selectorclick="emitClick"
        @selectorenter="emitEnter"
        :currentActiveForm="currentActiveForm"
      />
    </div>
    <AdminUserListFormSelectorBtn
      btnName="Default"
      @selectorclick="emitClick"
      @selectorenter="emitEnter"
      :currentActiveForm="currentActiveForm"
    />
  </div>
</template>


<script>

  import AdminUserListFormSelectorBtn from './AdminUserListFormSelectorBtn';

  export default {

    name: 'AdminUserListFormSelectors',

    props: {

      currentActiveForm: String,
    },

    components: {

      AdminUserListFormSelectorBtn,
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

      emitEnter({ data }) {

           this.sendEvent('changeselector', data);
      },

      emitClick ({ data }) {

        this.sendEvent('changeselector', data);
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

.admin-user-list-form-selectors {
    background-color: $gray;
    margin: 1.5rem auto 3rem auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
}

.main-form-selectors {
    display: flex;
    justify-content: space-evenly;
    width: 70%;
}



@media (max-width: 600px) {

  .admin-user-list-form-selectors {

    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 95%;
  }

  .main-form-selectors {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.75rem;
  }
}


</style>