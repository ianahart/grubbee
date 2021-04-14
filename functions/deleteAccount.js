const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { v4: uuidv4 } = require('uuid');
const verifyUserToken = require('./verifyUserToken');

const sendResponse = (
  (httpMsg, statusCode, body) => {

    httpMsg
    .status(statusCode)
    .send(
      {
      headers: {'Access-Control-Allow-Headers' : 'Authorization'},
      body,
      }
    );
  }
);


const updateUserTotal  = async (collection) => {

  let docID;

  let totalUsers;
  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .get();

    for (const document of documents.docs) {

        docID = document.id;

        totalUsers = document.data().total;
    }

    const totalsRef = db.collection(collection).doc(docID);

    await totalsRef.update(
      {
        total: totalUsers - 1,
      }
    );

  } catch (e) {

    console.log(e);
  }

};

const addToCollection = async (collection, { currentUserId, createdAt, reason, email }) => {

  try {

    const db = admin.firestore();

    await db.collection(collection)
    .add(
      {
        email,
        reason,
        createdAt,
        id: uuidv4(),
        userId: currentUserId,
      }
    );

  } catch (e) {

    console.log(e);
  }

};

const singleDeleteFromCollection = async (collection, userId, field) => {

  try {

    let documentId;

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where(field, '==', userId)
    .get();

    for (const document of documents.docs) {

      documentId = document.id;
    }

    const documentRef = db
    .collection(collection)
    .doc(documentId);

    await documentRef.delete();

  } catch (e) {

    console.log(e);
  }
};

const deleteAuthenticatedUser = async (userId) => {

  try {

    const auth = admin.auth;

    await auth().deleteUser(userId);

  } catch (e) {

    console.log(e);
  }
}


const multiDeleteFromCollection = async (collection, toMatch, field) => {

  let promises = [];

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where(field, '==', toMatch)
    .get();

    for (const document of documents.docs) {

        const operation = db
        .collection(collection)
        .doc(document.id)
        .delete();

        promises.push(operation);
    }


    await Promise.all(promises);

  } catch (e) {

    console.log(e);
  }

};

const deleteStorageUserImages = async (collection, toMatch, field) => {

  let fileNames = [];

  const promises = [];

  try {

    const bucket = admin.storage().bucket();

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where(field, '==', toMatch)
    .get();

    for (const document of documents.docs) {

      fileNames.push(document.data().image_file_name);
    }

    for (const fileName of fileNames) {

      promises.push(bucket.file(fileName).delete());
    }

    await Promise.all(promises);

  } catch (e) {

    console.log(e);
  }

};


const deleteAllUserData = async (req, res) => {

  let dataDeleted;

  try {

    await updateUserTotal('num_of_users');

    await addToCollection('deleted_accounts', req.body);

    await singleDeleteFromCollection('customer_testimonials', req.body.currentUserId, 'customerId');

    await deleteStorageUserImages('pending_restaurants', req.body.email, 'email');

    await multiDeleteFromCollection('pending_restaurants', req.body.email, 'email');

    await multiDeleteFromCollection ('favorites', req.body.currentUserId, 'userId');

    await deleteStorageUserImages('restaurants', req.body.currentUserId, 'restaurantOwnerId');

    await singleDeleteFromCollection('restaurants', req.body.currentUserId, 'restaurantOwnerId');

    await singleDeleteFromCollection('users', req.body.currentUserId, 'userId');

    await deleteAuthenticatedUser(req.body.currentUserId);

    dataDeleted = true;

    return dataDeleted;
  } catch (e) {

    console.log('deleteAllUserData Exception: ', e);

    dataDeleted = false;

    return dataDeleted
  }
};


const deleteUserAccount = async (req, res) => {

  try {

    const userDataFlushed = await deleteAllUserData(req, res);

    if (userDataFlushed) {

      sendResponse(res, 200,
        {
        error: null,
        accountDeleted: true,
        message: 'Success',
        }
      );
    }

  } catch (e) {

    console.log('Exception Message: ', e.message);

    sendResponse(res, 500,
      {
      error: e.message,
      accountDeleted: false,
      message: 'Internal server Error',
      }
    );
  };
};




exports.deletealluserdata = functions.
  https.onRequest(
    (request, response) => {

      return cors(request, response,
        async () => {
          const tokenVerified = await verifyUserToken(request, response);

          if (tokenVerified) {


            await deleteUserAccount(request, response);
          } else {

            response.status(403).send();
          }
        }
      );
  }
);