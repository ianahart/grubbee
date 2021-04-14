const functions = require('firebase-functions');
const cors = require('cors')( { origin: true });
const stripe = require('stripe')(functions.config().stripe.secret);
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const verifyUserToken = require('./verifyUserToken');



const sendResponse = (httpMsg, statusCode, body) => {

  httpMsg
  .status(statusCode)
  .send(
    {
    headers: {'Access-Control-Allow-Headers': 'Authorization'},
    body,
    }
  );
};

const compareDates = async (userId) => {

  let transactionTimestamp;

  let refundAvailable;

  const result = {
    refundAvailable: null,
    timeElapsed: '',
  };

    try {

      const db = admin.firestore();

      const transactions = await db
      .collection('transactions')
      .where('associatedUserId', '==', userId)
      .get();

      if (transactions._size === 1) {

        for (const transaction of transactions.docs) {

          transactionTimestamp = transaction.data().createdAt;
        }
      }

       const currentDateInSeconds = Math.round(Date.now() / 1000);

       const oneWeekInSeconds = 604800;

       const timeElapsed = currentDateInSeconds - transactionTimestamp;

       if (timeElapsed > oneWeekInSeconds) {

          refundAvailable = false;
       } else {

          refundAvailable = true;
       }

       result.refundAvailable = refundAvailable;

       result.timeElapsed = timeElapsed;

        return result;


    } catch (err) {

      console.log(err.message);
    }
};


const determineToShowRefund = async (req, res) => {

  try {

      const dateObj = await compareDates(req.body.currentUserId);

      sendResponse(res, 200,
        {
          statusCode: 200,
          trigger: 'determineToShowRefund',
          data: dateObj,
        }
     );

  } catch (err) {

      sendResponse(res, 200,
        {
          statusCode: 500,
          data: dateObj,
        }
      );
     }
};


const updateTransaction = async (transaction) => {
  let result;
  let metaUpdateInfo = {

    statusCode: null,
    didUpdate: null,
  };

  try {

    const db = admin.firestore();

    const documents = await db
    .collection('transactions')
    .where('chargeId', '==', transaction.chargeId)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

        const documentRef = db
        .collection('transactions')
        .doc(document.id);

        result = await documentRef.update(
          {
          status: 'refunded',
          }
        );
      }

        if (result._writeTime._seconds > 0) {

        metaUpdateInfo.statusCode = 202;

        metaUpdateInfo.didUpdate = true;
      }

      return metaUpdateInfo;
    }

  } catch (err) {

   metaUpdateInfo.statusCode = 500;

   metaUpdateInfo.didUpdate = false;

   return metaUpdateInfo;
  }
};

const deleteDocFromTable = async (customerId, tableName, field) => {

  try {

    const db = admin.firestore();

    if (tableName === 'restaurants') {

      await pruneStorage(customerId, tableName);
    }

    const documents = await db
    .collection(tableName)
    .where(field, '==', customerId)
    .get();

      for (const document of documents.docs) {

        const docToDeleteRef = await db
        .collection(tableName)
        .doc(document.id)
        .delete();
      }



  } catch (err) {

    throw err;
  }

};

const addToTable = async (docToAdd, tableName) => {

  try {

    const db = admin.firestore();

    const insertion = await db
    .collection(tableName)
    .add(docToAdd);

  } catch (err) {

    throw err;
  }

}


const processRefund = async (customerId, transaction) => {

  let refund;

  try {

    refund = await stripe.refunds.create(
      {
        charge: transaction.chargeId,
      }
    );

    refund.restaurantOwnerId = customerId;

    refund.email_sent = false;

    refund.uid = uuidv4();

    if (refund.id.length && refund.charge === transaction.chargeId) {

        await updateTransaction(transaction);

        await addToTable(refund, 'refunded_transactions');

        await deleteDocFromTable(customerId, 'restaurants', 'restaurantOwnerId');

        await deleteDocFromTable(customerId, 'favorites', 'restaurantOwnerId');


    }

    return refund;

  } catch (err) {

    return err;
  }
};


const refundUserAndPruneTables = async (customerId) => {

  let transaction;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection('transactions')
    .where('associatedUserId', '==', customerId)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

        transaction = document.data();
      }
    }

    const refundTicket = await processRefund(customerId, transaction);

    return refundTicket;


  } catch (err) {

    console.log(err.message);
  }
};


const pruneStorage = async (customerId, table) => {

  let imageFileName;

  let storagePruneSuccess = null;

  try {

    const bucket = admin.storage().bucket();

    const db = admin.firestore();

    const documents = await db
    .collection(table)
    .where('restaurantOwnerId', '==', customerId)
    .get();

    for (const document of documents.docs) {

      if (documents._size === 1) {

        imageFileName = document.data().image_file_name;
      }
    }

      if (imageFileName.length && imageFileName !== undefined) {

        await bucket.file(imageFileName).delete();

        storagePruneSuccess = true;
      } else {

        storagePruneSuccess = false;
      }

    return storagePruneSuccess;

  } catch (err) {

    console.log(err, err.message);

    return err;
  }
};



const stripeRefund = async (req, res) => {

  try {

    const refundTransactionStatus = await refundUserAndPruneTables(req.body.currentUserId);

    sendResponse(res, 200,
      {
        statusCode: 200,
        trigger: 'stripeRefund',
        data: refundTransactionStatus,
      }
    );
  } catch (err) {

    sendResponse(res, 200,
      {
        statusCode: 500,
        data: 'if you\'re reading this it DIDN\'T work',
      }
    );
  }
};



const runtimeOpts = {

  timeoutSeconds: 300,
  memory: '256MB',
};

exports.striperefund = functions

.runWith(runtimeOpts)
.https
.onRequest(
    (request, response) => {

    return cors (request, response,
      async () => {

      const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

        await stripeRefund(request, response);
      } else {

        response.status(403).send();
      }
      }
    );
  }
);

exports.determinetoshowrefund = functions
.https
.onRequest(
  (request, response) => {

  return cors (request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

        await determineToShowRefund(request, response);
      } else {

        response.status(403).send();
      }

    }
  );
 }
);






