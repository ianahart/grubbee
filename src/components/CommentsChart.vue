




<script>
import { firebase } from '@firebase/app';
import {Line} from 'vue-chartjs';




export default {
  extends: Line,

  name: 'CommentsChart',

  data() {

    return {
      db: firebase.firestore(),
      readableLabels: [],
      NumOfDaysToShow: 0,
      comments: [],
      chartLoading: true,
      organizedComments: [],
      monthNames:  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      chartData: {
      labels: [],
      datasets: [
        {
          label: 'Comments',
          backgroundColor: '#45aebf',
          data: []
        }
      ]
    },
    options: {

      title: {
        display: true,
        text: 'Past 30 Days Of Comments'
      },
      responsive:true,
      maintainAspectRatio: false
    }
    }
  },

  watch: {
    chartLoading: function () {

      if (this.chartLoading ===false) {

        this.renderChart(this.chartData, this.options)
      }
    }
  },


  created() {

    this.createChart();

  },


  methods: {


      createChart() {

        // const today = new Date();

            // console.log(date);
          // this.setReadableLabels(date);

        // this.setReadableLabels(today);

        // use these two lines to test at beginning of day (midnight)
        // const date = new Date();

        // date.setHours(0, 0, 1)

        this.setReadableLabels();

        this.getReviewsInsideThirtyDays();
      },
                        //@param setReadableLabels(today)
      setReadableLabels () {
        // console.log('TODAY: ', today);
        // let todayInSeconds = firebase.firestore.Timestamp.fromDate(today);



        const thirtyDaysSeconds = [];

        // let seconds;



        for (let i = 0; i < 30; i++) {

               const date = new Date();
              //  date.setHours(24, 0, 0) TEST A DAY AHEAD
               date.setHours(0,0,1);

              date.setDate(date.getDate() - i);

              const seconds = Math.round(date.getTime() / 1000);

              thirtyDaysSeconds.push(seconds);

            // if (thirtyDaysSeconds.length <= 0) {

            //    seconds = todayInSeconds.seconds;

            //     thirtyDaysSeconds.push(seconds);
            // } else {

            //   seconds = thirtyDaysSeconds[i -1] - 86400;

            //   thirtyDaysSeconds.push(seconds);
            // }
        }

        thirtyDaysSeconds.forEach(
          (time) => {

          let d = new Date(time * 1000).toString()

          const extractedDate = d.split(' ');

          this.readableLabels.push(
            {
            date:`${extractedDate[1]} ${extractedDate[2]}`,
            timestamp: time,
            numOfComments: 0,
           }
          );
        });
      },


      getReviewsInsideThirtyDays() {

        let startAtSeconds = firebase.firestore.Timestamp.fromDate(new Date());

          /*
          *
          *         maybe change 30 in currentmonthinseconds and dynamically add total num of days in current month
          *
          *
          */

        //   const today = new Date();

        //  const month = today.toLocaleString('default', { month: 'long' });

        //  const thirtyOne = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];

        //  const thirty = ['April', 'June', 'September', 'November'];

        //  const twentyEight = ['February'];

        //   let numOfDaysInMonth;

        //  if (thirtyOne.includes(month)) {

        //    numOfDaysInMonth = 31;
        //  } else if (thirty.includes(month)) {

        //    numOfDaysInMonth = 30;
        //  } else if (twentyEight.includes(month)) {

        //    numOfDaysInMonth = 28;
        //  }

                                              // 29 MAYBE
                                    // original 30
        //   const currentMonthInSeconds = 30 * 86400;

        //   let endOfDayWithInitialTimeSet = new Date(startAtSeconds.seconds * 1000);

        //     endOfDayWithInitialTimeSet.setHours(0)

        //     endOfDayWithInitialTimeSet.setMinutes(0);

        //     endOfDayWithInitialTimeSet.setSeconds(1);

        //     endOfDayWithInitialTimeSet = Math.round(endOfDayWithInitialTimeSet.getTime() / 1000);
        //     console.log(endOfDayWithInitialTimeSet);
        //     startAtSeconds.seconds = endOfDayWithInitialTimeSet  - currentMonthInSeconds;

        //       let startOfDayWithIntialTimeSet= new Date(startAtSeconds.seconds * 1000);


        //         startOfDayWithIntialTimeSet.setHours(24)

        //         startOfDayWithIntialTimeSet.setMinutes(0);

        //         startOfDayWithIntialTimeSet.setSeconds(1);

        //  let  calculatedSeconds =  startOfDayWithIntialTimeSet.getTime() / 1000;

        //  startAtSeconds.seconds = calculatedSeconds;

        //  let endAtSeconds = firebase.firestore.Timestamp.fromDate(new Date());

          const today = new Date()
          //  today.setHours(24, 0, 0) TEST A DAY AHEAD
          const priorDate = new Date().setDate(today.getDate()-30)

          const day = new Date();

          const hour = day.getHours();

          const minute = day.getMinutes();

          const second = day.getSeconds();

          const secondsUntilEndOfCurrentDay = (24 * 60 * 60) - (hour * 60 * 60) - (minute * 60) - second;

          startAtSeconds.seconds = Math.round(priorDate / 1000 + secondsUntilEndOfCurrentDay);

          const endAtSeconds = firebase.firestore.Timestamp.fromDate(new Date());

        this.db.collection('reviews')
        .orderBy('createdAt')
        .startAfter(startAtSeconds)
        .endAt(endAtSeconds)
        .get()
        .then(
          (querySnapshot) => {

          querySnapshot.forEach(
            (doc) => {

            this.comments.push(
                {
                date: this.formatDate(doc),
                numOfComments: 0,
                id: doc.id,
                timestamp: doc.data().createdAt.seconds
               }
            )

          return doc;

          })
        }).then(() => {

            this.comments = [...this.comments, ...this.readableLabels]
            .sort(
              (a,b) => a.timestamp - b.timestamp
              );

            this.comments.forEach((comment) => {

              this.countComments(comment);

            });

            this.organizedComments.forEach((organizedComment) => {

              this.chartData.datasets[0].data.push(organizedComment.numOfComments);

            });

                   this.readableLabels.reverse().forEach((date) => {

                    this.chartData.labels.push(date.date);
            })

            this.chartLoading = false;
        })
      },

      countComments (comment) {

        if (this.organizedComments.length <= 0) {

          this.organizedComments.push(comment);

        } else {


           let commentFound = this.organizedComments.findIndex(
             (organizedComment) => {

                return organizedComment.date === comment.date;
        });

            if (commentFound === -1) {

              this.organizedComments.push(comment);

            } else if(commentFound >= 0) {

              let duplicate = this.organizedComments.find(
                (organizedComment) => {

                   if(comment.date === organizedComment.date) {

                     return organizedComment;
                   }
              });

                  duplicate.numOfComments = duplicate.numOfComments + 1;
            }
          }
      },

      formatDate (doc) {

          const date = new Date(doc.data().createdAt.seconds * 1000);

          const month = this.monthNames[date.getMonth()].slice(0,3);

          let day = date.getDate();

              if (day < 10) {

                day = `0${day}`;
              }

         return `${month} ${day}`;
      },

      getDaysInMonth(month, year) {

        return new Date(year, month, 0).getDate();
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

//


</style>