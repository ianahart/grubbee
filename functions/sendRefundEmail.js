const os = require('os');
const path = require('path');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const inLineCss = require('nodemailer-juice');
const functions = require("firebase-functions");
const verifyUserToken = require('./verifyUserToken');


const configureRefundTemplate = require('./configureRefundTemplate.js');


const sendResponse = (httpAction, statusCode, body) => {

  httpAction
  .status(statusCode)
  .send(
    {
          headers: {'Access-Control-Allow-Headers': 'Authorization'},
          body,
    }
  );
};

const getFromTable = async (recipientID, tableName, field) => {

  let information;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .where(field, '==', recipientID)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

          information = document.data();
      }
    }

    return information;

  } catch (err) {

    return err ? null : '';
  }
};


const collectRecipientInfo = async (recipientID) => {

    const recipientInfo = {};

    try {

      const userInfo = await getFromTable(recipientID, 'users', 'userId');

      const transactionInfo = await getFromTable(recipientID, 'transactions', 'associatedUserId');

      const refundInfo = await getFromTable(recipientID, 'refunded_transactions', 'restaurantOwnerId');

      if (userInfo !== null
        && transactionInfo !== null
        && refundInfo !== null) {

        recipientInfo.user = userInfo;

        recipientInfo.transaction = transactionInfo;

        recipientInfo.refund = refundInfo;
      }

      return recipientInfo;

    } catch (err) {

      return err ? null : '';
    }

};


const processRefundEmail = async (data) => {

  try {

    const emailTemplate = configureRefundTemplate(data);

    let transporter = nodemailer.createTransport(
      {
      host: functions.config().nodemailer.host,
      port: functions.config().nodemailer.port,
      secure: true,

      auth: {
        user: functions.config().nodemailer.user,
        pass: functions.config().nodemailer.pass,
      },
      }
    );

    transporter.use('compile', inLineCss());

    let info = await transporter.sendMail(
      {
      from: functions.config().nodemailer.user,
      to: data.user.email,

      subject: 'Refund Confirmation:',
      html: emailTemplate,
      }
    );

     return info.messageId;

  } catch (err) {

    console.log(err);

    return err;
  }
};


const updateTable = async (recipientID, tableName, field, prop) => {

  const updateAction = {};

  try {

    let docToUpdate;

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .where(field, '==', recipientID)
    .get();


    if (documents._size === 1) {

      for (const document of documents.docs) {

        docToUpdate = document.id;
      }

    } else {

      throw 'Unable to update this tables property';
    }

    const documentRef = db.collection(tableName).doc(docToUpdate);

    const message = await documentRef.update(
      {
        [`${prop}`]: true,
      }
    );

    updateAction.didUpdate = true;

    updateAction.message = message;

    return updateAction;

  } catch (err) {

    updateAction.message = err;

    updateAction.didUpdate = false;

    return updateAction;
  }
};

const sendRefundEmail = async (req, res) => {

  let emailMessageId;
  let update;
  try {

    const recipient = await collectRecipientInfo(req.body.emailRecipientUserId);

     emailMessageId = await processRefundEmail(recipient);

      if (!recipient.refund.email_sent) {

        emailMessageId = await processRefundEmail(recipient);

      } else {

          sendResponse(res, 200,
            {
              statusCode: 422,
              response: 'email already sent',
              recipient,
            }
          );
      }

      if (emailMessageId.length) {

        update = await updateTable(recipient.refund.restaurantOwnerId,'refunded_transactions', 'restaurantOwnerId', 'email_sent');
      }

      sendResponse(res, 200,
        {
          statusCode: 200,
          update,
          emailMessageId,
          emailResponse: 'email sent',
          recipient,
        }
      );

  } catch (err) {

  sendResponse(res, 200,
    {
      statusCode: 500,
      response: 'email not sent',
    }
  );
 }
};


const runTimeOptions = {

  timeout: 300,
  memory: '1GB',
}

exports.sendrefundemail = functions
.runWith(runTimeOptions)
.https.onRequest(

  (request, response) => {

  return cors (request, response,
    async () => {

      const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

        await sendRefundEmail(request, response);
      } else {

        response.status(403).send();
      }
    }
   );
  }
);