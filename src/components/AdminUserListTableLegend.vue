<template>
  <div class="admin-user-list-table-legend">
    <h1>Legend</h1>
    <div class="legend-box">
      <div class="legend-row">
        <p>Restaurant Owner:</p>
        <div class="legend-color-swatch legend-ro"></div>
      </div>
      <div class="legend-row">
        <p>Not Restaurant Owner:</p>
        <div class="legend-color-swatch legend-nro"></div>
      </div>
      <div class="legend-row">
        <p>(5) Reviews or More:</p>
        <div class="legend-color-swatch legend-eq-5-r"></div>
      </div>
      <div class="legend-row">
        <p>Less Than (5) Reviews:</p>
        <div class="legend-color-swatch legend-lt-5-r"></div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {

    name: 'AdminUserListTableLegend',

    props: {

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

    methods: {

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

.admin-user-list-table-legend {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {

    font-weight: 100;
    color: lighten($black, 10);
  }

}

.legend-box {

  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.legend-row {
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size:0.9rem;
    margin: 0.3rem;
    color: lighten($black, 10);
  }
}

.legend-color-swatch {
  height: 17px;
  width: 17px;
  margin-left: 0.3rem;
  background-color: blue;
}

.legend-lt-5-r {
background-color: lighten($black, 10);
}
.legend-eq-5-r {
  background-color: lighten(green, 7);
}
.legend-nro {
  background-color: $red;
}
.legend-ro {
  background-color: $lightBlue;
}

</style>