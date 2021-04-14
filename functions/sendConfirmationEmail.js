
const os = require('os');
const path = require('path');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const inLineCss = require('nodemailer-juice');
const functions = require("firebase-functions");

const PDFGenerator = require('./PDFGenerator.js');
const configureEmailTemplate = require('./configureTemplate.js');
const formatDateAdded = require('./formatDate.js');
const verifyUserToken = require('./verifyUserToken');




const send = (httpMsg, statusCode, data) => {

  httpMsg.status(statusCode).send(
    {
      headers: {'Access-Control-Allow-Headers': 'Authorization'},
      data,
    }
  );
}

const getUserInformation = async (req, res) => {

  try {

     const action = req.body.action;

     const db = admin.firestore();

     const userId = req.body.currentUserId;

     let documents = await db
     .collection('users')
     .where('userId', '==', userId)
     .get();

     if (documents) {

      if (documents.size <= 0) {

            return send(res, 200, {

              errorMessage: 'Unable to retrieve your user information.',
              statusCode: 500,
            }
            );

          } else {

            let userData;

            for (const document of documents.docs) {

                userData = document.data();
            }

            return send(res, 200,
            {
              data: userData,
              action: action,
              statusCode: 200,
            }
            );

          }
     }
  } catch (err) {

    send(res, 200,
     {
      errorMessage: 'There was a problem sending email. Please contact our help support',
      statusCode: 500
     }
    );
  }
}

const getRestaurantForEmail = async (userId) => {

  const errorMessage = 'Confirmation email not sent. There was a problem locating your restaurant. Please reach out to our help support.';

  const error = {};

  let restaurant = '';

  let documents = '';

  try {

    const db = admin.firestore();

   documents = await db
    .collection('restaurants')
    .where('restaurantOwnerId', '==', userId)
    .get();

    if (documents._size <= 0) {

         throw errorMessage;
    }

    for (const document of documents.docs) {

        restaurant = document.data();
    }

    return restaurant;

  } catch (err) {

    error.message = err;

    error.status = 500;

    return error;
  }
}



const downloadPDFAttachment = async () => {


     const bucket = admin.storage().bucket();

    const localTempFile = path.join(os.tmpdir(), 'localNoticePDF.pdf');

    const isFound = await bucket.file('localNoticePDF.pdf').exists();
    console.log(isFound);
    if (isFound) {

      await bucket.file('localNoticePDF.pdf').download({ destination: localTempFile });
    }



   return localTempFile;

};


const sendConfirmationEmail = async (customer, restaurant) => {


  let info = '';

  try {
      await PDFGenerator();

     const attachment =  await downloadPDFAttachment();


      const date = formatDateAdded(restaurant.createdAt);

      restaurant.createdAt = date;

      const emailTemplate =  configureEmailTemplate(customer, restaurant);



      const transport =  {

          host: functions.config().nodemailer.host,
          port: functions.config().nodemailer.port,
          secure: true,

          auth: {
            user: functions.config().nodemailer.user,
            pass: functions.config().nodemailer.pass,
          },
        };

        const transporter = nodemailer.createTransport(transport);

        transporter.use('compile', inLineCss());

       const message = {

          from: functions.config().nodemailer.user,
          to: customer.currentUserEmail,

          subject: 'Payment Confirmation',
          text: 'please please work',
          html: emailTemplate,
          attachments: [
            {
              filename: 'agreement.pdf',
              path: '/tmp/localNoticePDF.pdf',
              contentType: 'application/pdf',
            },
          ]

        };

        if (attachment) {

          info = await transporter.sendMail(message);
        }

      return info;

    } catch (err) {

      console.log(err.message);
    }
}


const processConfirmationEmail = async (req, res) => {
  let confirmationData = '';
  try {



    const action = req.body.action;

    const restaurant = await getRestaurantForEmail(req.body.currentUserId);

    if (restaurant.status === 500) {

      throw restaurant;
    } else {

     confirmationData = await sendConfirmationEmail(req.body, restaurant);
  }


    send(res, 200,
      {
        statusCode: 200,
        action: action,
        restaurant: restaurant,
        emailConfirmation: confirmationData,
      }
    )

  } catch (err) {

    send(res, 200,
      {
        message: 'it didnt work',
        statusCode: 500,
        errorMessage: err.message,
      }
    );
  }
}

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '2GB'
  }

exports.getuserinformation = functions.https.onRequest(
  (request, response) => {

  return cors (request, response, async () => {
    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

      await getUserInformation(request, response);
    } else {

      response.status(403).send();
    }
  });
});


exports.sendconfirmationemail = functions.runWith(runtimeOpts).https.onRequest(
  (request, response) => {

  return cors (request, response, async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

       await processConfirmationEmail(request, response);
    } else {

      response.status(403).send();
    }
  });
});