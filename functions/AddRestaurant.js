const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { v4: uuidv4 } = require('uuid');
const verifyUserToken = require('./verifyUserToken');


const getPendingRequest = async (idToQuery) => {

  let document = '';

  try {

    const db = admin.firestore();

    const matched = await db.collection('pending_restaurants')
    .where('id', '==', idToQuery)
    .get();


    for (const doc of matched.docs) {

      document = doc.data();
    }


  } catch (err) {

    console.log(err.message);
  }

  return document;
}

const removePendingRequest = async (id, db) => {

  try {

    let docToDelete;

    const snapshot = await db.collection('pending_restaurants')
    .where('id', '==', id)
    .get();

    for (const doc of snapshot.docs) {

      docToDelete = doc.id;
    }

    await db.collection('pending_restaurants').doc(docToDelete).delete();

  } catch (err) {

    console.log(err.message);
  }
}

const addRestaurant = async (data, pendingIdToRemove, userid) => {

    try {
      const restaurant = {

        id: uuidv4(),
        address: data.address,
        city: data.city,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        email: data.email,
        firstName: data.firstName,
        image_url: data.image_url,
        image_file_name: data.image_file_name,
        lastName:  data.lastName,
        name: data.name,
        phone: data.phone,
        reviews: data.reviews,
        search: data.search,
        state: data.state,
        zip_code: data.zip_code,
        restaurantOwnerId: userid,
        avg_rating: 0,

      }

      const db = admin.firestore();

      await db.collection('restaurants').add(restaurant);

      await removePendingRequest(pendingIdToRemove, db);


    } catch (err) {

      console.log(err.message);
    }

}


const handleRestaurant = async (request, response) => {

  try {

    const pendingid = request.body.pendingid;

    const userid = request.body.userid;

    const requestedRestaurant = await getPendingRequest(pendingid);

    await addRestaurant(requestedRestaurant, pendingid, userid);

    response.status(200).send(
      {
       headers: {'Access-Control-Allow-Headers': 'Authorization'},
       statusCode: 200,
       message: 'Restaurant has been successfully added',
       paymentConfirmation: 'Your payment succeeded',
      }
    );
  } catch (err) {

    response.status(500).send(
      {
      headers: {'Access-Control-Allow-Headers': 'Authorization'},
      statusCode: 500,
      message: 'Unable to add restaurant at this time'
     }
    )
  }
};

exports.addrestaurant = functions.https.onRequest(
  (request, response) => {

    return cors (request, response,
      async () => {
        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {


          await handleRestaurant(request, response);
        } else {

          response.status(403).send();
        }
    });
});



