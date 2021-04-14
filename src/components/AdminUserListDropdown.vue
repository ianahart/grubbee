<template>
  <div class="admin-user-list-dropdown-container">

    <div
      class="admin-user-list-dropdown"
      :tabindex="isdropdownOpen ? '' : '0'"
      @keydown.prevent="dropdownAcessibility($event, currentListItem)"
      @click.stop="toggleDropdown"

    >
      <h5

      >
        {{ dropdownSelection }}
      </h5>
      <svg fill="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"></path></svg>

        <div
          ref="dropdownList"
          v-if="isdropdownOpen"
          class="admin-user-list-dropdown-list"
          :tabindex="isdropdownOpen ? '0' : ''"
          @keydown.prevent="focusDropdown($event)"
        >
          <ul>
            <AdminUserListDropdownItem
              @optionchange="handleOptionChange"
              v-for="(item, index) in listItems"
              :key="index"
              :option="item"
              :currentListItem="currentListItem"
              :selectedListItem="selectedListItem"
            />
          </ul>
      </div>
    </div>
  </div>
</template>


<script>


  import AdminUserListDropdownItem from './AdminUserListDropdownItem';

  export default {

    name: 'AdminUserListDropdown',

    components: {

      AdminUserListDropdownItem,
    },

    props: {
    currentPage: Number,
    dropdownSelection: String,

    },
    data () {

      return {

        isdropdownOpen: false,
        listItems: ['Newest', 'Oldest'],
        selectedListItem: '',
        currentListItem: '',
        currentListIndex: 0,

      }
    },


    created () {

    },

    mounted () {


      document.addEventListener('click', this.closeDropdown);
    },


    beforeDestroy() {

      document.removeEventListener('click', this.closeDropdown);
    },

    computed: {

    },

    watch:  {

      currentPage() {

        if (this.dropdownSelection === 'Sort') {

          this.selectedListItem = '';
          this.currentListItem = '';
        }
      },
    },

    methods: {

      focusDropdown (e) {

        if (e.key === 'ArrowUp') {

          this.moveUpList();
        }

        if (e.key === 'ArrowDown') {

            this.moveDownList();
        }

        if (e.key === 'Escape') {

          this.isdropdownOpen = false;
        }
      },

      moveDownList () {

        if (this.currentListIndex === this.listItems.length - 1) {

          return;
        } else {

          this.currentListIndex = this.currentListIndex + 1;

          this.currentListItem = this.listItems[this.currentListIndex];
        }
      },

      moveUpList () {

        if (this.currentListIndex <= 0) {

          return;
        } else {

          this.currentListIndex = this.currentListIndex - 1;

          this.currentListItem = this.listItems[this.currentListIndex];

        }
      },


      sendEvent(event, data) {

        this.$emit(event,
          {
            data
          }
        );
      },

      toggleDropdown () {

        this.isdropdownOpen  = !this.isdropdownOpen;
      },

      closeDropdown () {

        this.isdropdownOpen = false;
      },

      handleOptionChange ({ data }) {

        this.selectedListItem = data;

        this.sendEvent('setdropselectionclick', data);
      },

      dropdownAcessibility (e, item) {

          if (e.keyCode === 38 || e.keyCode === 40) {

            this.isdropdownOpen = true;

            this.$nextTick(() => {
                  this.$refs.dropdownList.focus();
            });
          }

          if (e.keyCode === 13) {

            this.selectedListItem = item;

            this.sendEvent('setdropselectionenter', item);

            this.isdropdownOpen = false;
          }
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

.admin-user-list-dropdown-container {
  margin: 2rem auto;
  width: 95%;
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.admin-user-list-dropdown {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid $blue;
    border-radius: 0.25rem;
    padding: 0.3rem;
    cursor:default;

    h5 {
      font-weight: bold;
      margin: 0;
    }
}


.admin-user-list-dropdown-list {
  width: 100%;
  height: 100%;
  z-index: 10;
  padding: 1rem 0;
  top: 0;
  left: 0;
  border-radius: 0.5rem;
  position: absolute;
  background-color: rgba(61,90,128, 0.9);
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  ul {
    width: 100%;
    padding: 0;
  }


  li {
    color: darken($offwhite, 5);
    margin: 0.3rem 0;
    font-weight: bold;
    cursor:default;
    padding: 0.2rem 0;
    &:hover {
     background-color: rgba(42,64,89, 0.7);
      border-radius: 0.5rem;
    }
  }
}



@media(max-width: 600px) {
  .admin-user-list-dropdown {

    justify-content: center;
  }
}

</style>