const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const verifyUserToken = require('./verifyUserToken');



const sendResponse = (httpMsg, statusCode, body) => {

  httpMsg.status(statusCode).send(
    {
    headers: {'Access-Control-Allow-Headers': 'Authorization'},
    body,
    }
  );
}


const deleteFromTable = async (restaurantId, tableName, field) => {
    const result = {};

    try {

      const db = admin.firestore();

      const documents = await db
      .collection(tableName)
      .where(field, '==', restaurantId)
      .get();




        for (const document of documents.docs) {

          const docID = document.id;

         result.data = await db
          .collection(tableName)
          .doc(docID)
          .delete();
        }
        console.log(result.data);
        result.statusCode = 204;

        result.error = null;

        return result;

    } catch (err) {

        result.statusCode = 500;

        result.error = 'resources not deleted';

        result.data = null;

        return result;
    }
};

const updateTransaction = async (currentUserId) => {

  const transaction = {};
  let docID;
  try {

    const db = admin.firestore();

    const documents = await db
    .collection('transactions')
    .where('associatedUserId', '==', currentUserId)
    .get();


      for (const document of documents.docs) {

        if (document.data().status === 'completed') {

          docID = document.id;


        const docRef = db.collection('transactions').doc(docID);

        transaction.data = await docRef
        .update(
          {
            status: 'cancelled',
          }
        );

        transaction.error = null;
       }
     }
        console.log(transaction);
      return transaction;


  } catch (err) {

      transaction.data = null;

      transaction.error = err.message;

      return transaction;
  }

};



const deleteFromStorage = async (restaurantId, tableName, field) => {

  let fileName;

  try {

    const db = admin.firestore();

    const bucket = admin.storage().bucket();

    const documents = await db
    .collection(tableName)
    .where(field, '==', restaurantId)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

        fileName = document.data().image_file_name;
      }
    }

    await bucket.file(fileName).delete();

  } catch (err) {

    throw err;
  }

};

const handleDeleteRequest = async (req, res) => {


  try {

      await updateTransaction(req.body.currentUserId);

      await deleteFromStorage(req.body.restaurantId, 'restaurants', 'id');

      await deleteFromTable(req.body.restaurantId, 'restaurants', 'id');

      await deleteFromTable(req.body.restaurantId, 'favorites', 'restaurantId');

      sendResponse(res, 200,
        {
        status: 204,
        message: 'success',
        errors: [],

        }
      );
    }

   catch (err) {

    sendResponse(res, 200,
      {
      status: 500,
      message: 'failure',
      errors: err,
      data: null,
      }
    );
  }
}

const constructDate = (timestamp) => {

  const date = new Date(1970, 0, 1);

  date.setSeconds(timestamp);

  const month = date.toLocaleString('default', {month: 'long'});

  const fullYear = date.getFullYear();

  let day = date.getDate();

  if (day < 10) {

    day = '0' + day;
  }

  const formattedDate = `${month} ${day}, ${fullYear}`;

  return formattedDate;
};



const getTransactionDate = async (currentUserId) => {

  const result = {};

  const docsArr = [];


    try {

      const db = admin.firestore();

      const documents = await db
      .collection('transactions')
      .where('associatedUserId', '==', currentUserId)
      .get();

        for (const document of documents.docs) {

            docsArr.push(document.data());
        }

        const transactionToRetrieve = docsArr
        .filter(
          (document) => {

              return document.status === 'completed' ? document : '';
          }
        );

        console.log(transactionToRetrieve);
            const timestamp = transactionToRetrieve[0].createdAt;

            const formattedTransactionDate = constructDate(timestamp);

            result.transactionDate = formattedTransactionDate;

            result.owner = transactionToRetrieve[0].name;

            result.error = null;

// CANNOT READ .SPLIT(' ') OF UNDEFINED


        result.owner = result.owner
        .split(' ')
        .map(
          (str) => {

          return str.toUpperCase().slice(0, 1) + str.toLowerCase().slice(1);
           }
        )
        .join(' ');

        return result;

    } catch (err) {

        result.transactionDate = null;

        result.error = err.message;

        return result;
    }
};

const handleTransactionDate = async (req, res) => {

  try {

    const body = await getTransactionDate(req.body.currentUserId);

    if (body.error === null) {

      sendResponse(res, 200,
        {
        status: 200,
        message: 'success',
        error: body.error,
        data: body,
        }
      );
    } else {

      sendResponse(res, 200,
        {
        status: 400,
        error: body.error,
        message: 'failure',
        data: body,
        }
      );
    }



  } catch (err) {

    sendResponse(res, 200,
      {
      status: 500,
      message: 'failure',
      errors: ['this is an error'],
      data: null,
      }
    );
  }
}

const getRestaurantName = async (currentUserId) => {

  let restaurant = {};

  try {

      const db = admin.firestore();

      const documents = await db
      .collection('restaurants')
      .where('restaurantOwnerId', '==', currentUserId)
      .get();

      if (documents._size === 1) {

        for (const document of documents.docs) {

          restaurant.restaurantId = document.data().id;

          restaurant.restaurantName = document.data().name;
        }

        return restaurant;
      } else {

        restaurant.restaurantId = null;

        restaurant.restaurantName = null;

        return restaurant;
      }
  } catch (err) {

    restaurant.restaurantId = null;

    restaurant.restaurantName = null;

    restaurant.error = err.message;

    return restaurant;
  }
}


const handleRestaurantName = async (req, res) => {

  try {

      const restaurant = await getRestaurantName(req.body.currentUserId);

      if (restaurant.restaurantName !== null && restaurant.restaurantId !== null) {

        sendResponse(res, 200,
          {
          status: 200,
          message: 'success',
          error: null,
          data: restaurant,
          }
        );
      } else {

        sendResponse(res, 200,
          {
          status: 404,
          message: 'failure',
          error: restaurant.error,
          data: null,
          }
        );
      }

  } catch (err) {

    sendResponse(res, 200,
      {
      status: 500,
      message: 'failure',
      errors: err,
      data: null,
      }
    );
  }
}

exports.getrestaurantname = functions.https.onRequest(
  (request, response) => {

  return cors(request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

      await handleRestaurantName(request, response);
    } else {

      response.status(403).send();
    }
  });
});

exports.deleterestaurant = functions.https.onRequest(
  (request, response) => {

  return cors(request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

       await handleDeleteRequest(request, response);
    } else {

      response.status(403).send();
    }
  });
});

exports.gettransactiondate = functions.https.onRequest(
  (request, response) => {
  return cors(request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

     await handleTransactionDate (request, response);
    } else {

      response.status(403).send();
    }
  });
});


