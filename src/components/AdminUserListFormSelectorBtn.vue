<template>
  <!-- <div

    class="admin-user-list-form-selector-btn"
         @keydown="sendSelectorEnter($event)"
                 tabindex="0"

   > -->
    <button
       ref="selector"
      :class="`admin-user-list-form-selector-btn ${activeBtn}`"
      @click="sendSelectorClick(btnName)"
      @keydown="sendSelectorEnter($event)"
      tabindex="0"

    >
    {{ btnName }}
    </button>
  <!-- </div> -->
</template>

<script>

  export default {

    name: 'AdminUserListFormSelectorBtn',

    props: {
      btnName: String,
      currentActiveForm: String,
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

      activeBtn: function () {


          return this.btnName === this.currentActiveForm ? 'active-btn' : '';


      }


    },
    methods: {

      sendEvent (event,  data) {

        this.$emit(event,
          {
            data,
          }
        );
      },

      sendSelectorEnter (e) {
          console.log(e);
        let btn = this.$refs.selector.innerText;

        this.sendEvent('selectorenter', btn);

      },

      sendSelectorClick (btnText) {

        this.sendEvent('selectorclick', btnText);
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


.admin-user-list-form-selector-btn {

    width: 120px;
    height: 35px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    border: none;
    font-weight: 900;
    color: lighten($black, 5);
    outline: none;

}



.active-btn {

  background-color: $lightBlue;
  color: $gray;
}





@media (max-width: 600px) {
  .admin-user-list-form-selector-btn {
    margin: 0.5rem 0;
  }
}

</style>