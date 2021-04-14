const formatDateAdded = (timestamp) => {
  let dateString;

  if (typeof timestamp === 'object') {

    dateString = timestamp.toDate();
  } else {

    const date = new Date(1970, 0, 1);

    date.setSeconds(timestamp);

    dateString = date;
  }



          const date = {
            month: '',
            day: '',
            year: '',
          }

          date.month = dateString.getMonth() + 1;

          date.day = dateString.getDate();

          date.year = dateString.getFullYear();

          if (date.month < 10 ) {

            date.month = `0${date.month}`;
          } else if (date.month > 12) {

            date.month = `01`;
          }

          if (date.day < 10) {

            date.day = `0${date.day}`;
          }

          const formattedDate = `${date.month}/${date.day}/${date.year}`;

          return formattedDate;

}

module.exports = formatDateAdded;