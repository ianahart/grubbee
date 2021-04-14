<template>

  <li
    :class="activeListItem"
    ref="current"
    @click="selectListItemClick(option)"
  >
    <span v-if="selectedListItem === option">&#x2714;</span>
    <span>{{ option }}</span>
</li>


</template>


<script>

  export default {

    name: 'AdminUserListDropdownItem',

    props: {
      option: String,
      selectedListItem: String,
      currentListItem: String,
    },

    components: {

    },

    data () {

      return {

        isMounted: false,
      }
    },

    created () {

    },

    mounted () {

      this.isMounted = true;
    },

    computed: {

      activeListItem () {

        let className;

        if (this.isMounted) {

          if (this.option === this.currentListItem) {

            className = 'active-drop-down-item';
          } else {

            className = '';
          }
        }

       return className;
      },
    },

    methods: {

      sendEvent(event, data) {

        this.$emit(event,
          {
            data
          }
        );
      },
      selectListItemClick(option) {

        this.sendEvent('optionchange', option);
      },
    },
  };
</script>




<style lang="scss">

$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;


.active-drop-down-item {
  background-color: rgba(42,64,89, 0.7);
  border-radius: 0.5rem;
}

</style>