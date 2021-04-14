<template>
  <div class="map-container">
      <div  class="map" :id="`map${restaurant.id}`"></div>
  </div>
</template>



<script>

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'Map',
  props: {
    restaurant: Object,
    coords: Array,
    center: Array,
  },
  data () {
    return {


    }
  },



 mounted() {

  this.setupMap();



 },

  methods: {

    setupMap() {

          const map = L.map(`map${this.restaurant.id}`).setView([this.center[1], this.center[0]],12);

          const icon = new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
          });

           L.marker(this.coords.reverse(), {icon}).addTo(map);

          L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.VUE_APP_MAPBOX_API_KEY
    })
    .addTo(map);
    }
  }
}

</script>


<style lang="scss">

.map {
  height: 200px;
  width: 200px;
  border-radius: 11px;
}

.map-container {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .map-container {
    justify-content: center;
  }
}


</style>
