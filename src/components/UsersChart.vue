


<script>

import {Doughnut} from 'vue-chartjs';


export default {
  name: 'UserChart',
  extends: Doughnut,
  props: {
    db: Object,
    currentYear: Number,
  },
  data() {
    return {
      months: [],
      isLoading: true,

      seasonTallies: {
        winter: 0,
        spring: 0,
        summer: 0,
        fall: 0,
      },
      chartData: {
          labels: ["Winter",	"Spring",	"Summer",	"Fall"],
          datasets: [{
              borderWidth: 2,
              borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(128,99,61, 1)',
              'rgba(75, 192, 192, 1)'
              ],
              backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(128,99,61, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              ],
              data: [],
            }]
        },
         options: {
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
    }
  },

  created() {

    this.makeChartData();
  },

 watch: {
   isLoading: function () {

     if (!this.isLoading) {

        this.renderChart(this.chartData, this.options);
     }
   }
 },
  methods: {
      makeChartData() {

        this.db.collection('users')
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

              const month = doc.data().createdAt.toDate().getMonth() + 1;

              // if (this.currentYear === doc.data().createdAt.toDate().getFullYear()) {

                  this.months.push(month);
              // }
          });
        }).then(() => {

          this.tallyUpMonths()
        });
      },

      tallyUpMonths() {

        this.months.forEach(

          (month) => {

          this.determineSeason(month);
        });

        this.chartData.datasets[0].data.push(...Object.values(this.seasonTallies));

        this.isLoading = false;

      },

      determineSeason(month) {

        if (month === 12 || month >= 1 && month <= 2 ) {

          this.seasonTallies.winter = this.seasonTallies.winter + 1;
        } else if (month >= 3 && month <= 5) {

          this.seasonTallies.spring = this.seasonTallies.spring + 1;
        } else if (month >= 6 && month <= 8) {

          this.seasonTallies.summer = this.seasonTallies.summer + 1;
        } else {

          this.seasonTallies.fall = this.seasonTallies.fall + 1;
        }
      }
  }
}

</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;
</style>