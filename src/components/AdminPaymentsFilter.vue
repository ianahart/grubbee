<template>
  <div class="admin-payments-filter">
      <select  @change="sendFilterChange($event)" v-model="filter">
        <option selected value="">{{ defaultSelect }}</option>
        <option value="completed">completed</option>
        <option value="refunded">refunded</option>
        <option value="cancelled">cancelled</option>
    </select>
  </div>
</template>


<script>
export default {

  name: 'AdminPaymentsFilter',

  props: {

  },

  components: {

  },

  data () {

    return {
      filter: '',
      defaultSelect: 'Filter By',
    }
  },

  created () {

  },

  mounted () {

  },


  methods: {

    sendFilterChange (event) {

      const selectedFilter = event.target.value;

      if (selectedFilter === '') {

        this.defaultSelect = 'Filter By';
      }  else {

        this.defaultSelect = 'Clear Filter';
      }

      this.$emit('filter',
        {
          selectedFilter
        }
      );
    }

  },
}
</script>

<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.admin-payments-filter {
  display: flex;
  justify-content: flex-end;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>