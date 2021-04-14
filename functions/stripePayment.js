const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(functions.config().stripe.secret);
const { v4: uuidv4 } = require('uuid');
const verifyUserToken = require('./verifyUserToken');


const addTransaction = async (chargeId, data, userId) => {
  try {
    const document = {
      id: uuidv4(),
      createdAt: data.created,
      address: data.card.address_line1,
      cardbrand: data.card.brand,
      city: data.card.address_city,
      country: data.card.address_country,
      currency: data.card.currency,
      expmonth: data.card.exp_month,
      expyear: data.card.exp_year,
      lastfourdigits: data.card.last4,
      name: data.card.name,
      state: data.card.address_state,
      zipcode: data.card.address_zip,
      associatedUserId: userId,
      amount: '10.00',
      chargeId,
      status: 'completed',
    };

    const db = admin.firestore().collection('transactions');

    await db.add(document);
  } catch (err) {
    console.log(err);
  }
};

const send = async (res, code, body, cardInfo) => {


  const userId = body.userId;

  if (body.statusCode === 200) {

    const chargeId = body.chargeConf.id;

    await addTransaction(chargeId, cardInfo, userId);
  }

  return res.status(code).send({
    status: code,
    headers: {'Access-Control-Allow-Headers': 'Authorization'},
    body,
  });
};

const checkCustomerRestaurant = async (customerId) => {
  try {
    const db = admin.firestore();

    const documents = await db
      .collection('restaurants')
      .where('restaurantOwnerId', '==', customerId)
      .get();

    if (documents.size > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const removePendingRestaurant = async (pendingRestaurantId) => {
  try {
    let restaurantToDeleteRef;

    const db = admin.firestore();

    const restaurants = await db
      .collection('pending_restaurants')
      .where('id', '==', pendingRestaurantId)
      .get();

    for (const restaurant of restaurants.docs) {
      restaurantToDeleteRef = restaurant.id;
    }

    await db
      .collection('pending_restaurants')
      .doc(restaurantToDeleteRef)
      .delete();
  } catch (err) {
    console.log(err.message);
  }
};

const charge = async (request, res) => {
  const amountToCharge = 1000;

  const token = request.body.token.token.id;

  const currency = request.body.token.token.card.currency;

  const cardInfo = request.body.token.token;

  const pendingRestaurantId = request.body.pendingid;

  const existingRestaurantFound = await checkCustomerRestaurant(
    request.body.userId
  );

  try {
    if (existingRestaurantFound) {
      await removePendingRestaurant(pendingRestaurantId);

      return send(res, 200, {
        statusCode: 500,
        message: 'You can only have one restaurant per account.',
        error: 'max restaurants',
      });
    } else {
      const chargeConf = await stripe.charges.create({
        amount: amountToCharge,
        currency: currency,
        source: token,
        description: 'Restaurant signup payment',
      });

      send(
        res,
        200,
        {
          statusCode: 200,
          message: 'Your payment was successful',
          userId: request.body.userId,
          chargeConf,
        },
        cardInfo
      );
    }
  } catch (err) {
    send(res, 500, {

      message:
        'Trouble processing your card. Please try again or contact your bank.',
      error: err.message,
    });
  }
};

exports.charge = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

      await charge(request, response);
    } else {

      response.status(403).send();
    }
  });
});
