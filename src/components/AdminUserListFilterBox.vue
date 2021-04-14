<template>
  <div class="admin-user-list-filter-box">
    <input @keyup="sendFilter(filterInput)" placeholder="Search by name..." v-model="filterInput"/>
    <button @click="clearFilter">Clear Filter</button>
  </div>
</template>


<script>

  export default {

    name: 'AdminUserListFilterBox',

    props: {
      nameFilterCleared: Boolean,
    },

    components: {

    },

    data () {

      return {
        filterInput: '',
        debounceID: '',
        interval: 500,
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

      nameFilterCleared () {

        if (this.nameFilterCleared) {

           this.clearInput();

           this.sendEvent('resetfilterstate');
        }
      },
    },

    beforeDestroy() {

      clearTimeout(this.debounceID);
    },

    methods: {

      sendEvent (event, filterValue) {

        this.$emit(event,
          {
            filterValue,
          }
        );
      },

      sendFilter(filterValue) {

        clearTimeout(this.debounceID);

        this.debounceID = setTimeout(() => {

          this.sendEvent('filter', filterValue);

        }, this.interval);
      },

      clearInput() {

        this.filterInput = '';
      },

      clearFilter() {

        this.sendEvent('clearfilter');
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

.admin-user-list-filter-box {

  display: flex;
  justify-content: space-between;
  // margin: 2rem 1rem;
  width: 95%;
  margin: 0 auto;

  button {
    height: 30px;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    border: none;
    background-color: darken($gray, 5);
    width: 120px;
    border-radius: 0.25rem;;

    &:hover {
      background-color: $gray;
    }
  }

  input {
    height: 30px;
    width: 170px;
    border-radius: 0.25rem;
    border: 1px solid darken($gray, 7);
  }
}


@media(max-width: 600px) {

  .admin-user-list-filter-box {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
      margin-top: 2rem;
    }

  }
}

</style>