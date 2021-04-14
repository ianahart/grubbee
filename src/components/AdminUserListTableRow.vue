<template>
  <tr
    :class="`admin-user-list-table-row ${this.currentRow === this.user.userId ? 'highlight-row': ''}`"
    @click="highlightRow(user.userId)"
  >

    <td>
      <i
        v-if="this.currentRow === this.user.userId"
        class="fas fa-long-arrow-alt-right table-selection-arrrow"
      >
      </i>
    </td>
    <td>{{ user.id }}</td>
    <td>{{ user.firstName }}</td>
    <td>{{ user.lastName }}</td>
    <td>{{ user.email }}</td>
    <td
      :class="{
        'restaurant-true': user.hasRestaurant.toLowerCase() === 'yes',
        'restauraunt-false': user.hasRestaurant.toLowerCase() === 'no',

      }"
    >
      {{ user.hasRestaurant }}
    </td>
    <td>{{ user.restaurantName }}</td>
    <td>{{ user.lastLoginReadableDate }}</td>
    <td :class="reviewColor">{{ user.reviews.length }}</td>
    <td>{{ user.createdAtReadableDate }}</td>
  </tr>
</template>

<script>

  export default {

    name: 'AdminUserListTableRow',

    props: {
      user: Object,
      currentRow: String,
    },

    components: {

    },

    data () {

      return {
        reviewColor: '',
        rowClicked: false,
      }
    },

    created () {

    },

    mounted () {

      this.reviewColor = this.assignReviewClasses(this.user.reviews.length);
    },

    methods: {

      assignReviewClasses (number) {

        let className = 'reviews-lt-5';

        if (number >= 5) {

          className = 'reviews-gt-eq-5';
        }

         return className;
      },

      sendEvent(event, data) {

        this.$emit(event,
          {
            data
          }
        );
      },

      highlightRow (selectedRow) {

        this.sendEvent('selectedrow', selectedRow);

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


.highlight-row {
  border-bottom: 2px solid $gray;
}

.admin-user-list-table-row {
  td {
    padding: 1rem;
    padding-bottom: 0.5rem;
    cursor: pointer;
    font-weight: bold;
  }
}

.restaurant-true,
.restaurant-false {
  font-weight: 900;
}

.restaurant-true {
  color: $lightBlue;
}

.restauraunt-false {
  color: $red;
}

.reviews-gt-eq-5 {
  color: lighten(green, 7);
}

.reviews-lt-5 {
  color: lighten($black, 10);
}

.table-selection-arrrow {
  color: $blue;
  font-size: 1.2rem;
}

</style>