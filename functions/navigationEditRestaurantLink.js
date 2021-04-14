const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require("firebase-functions");
const verifyUserToken = require('./verifyUserToken');


const sendResponse = ( http, statusCode, body) => {

   http.status(statusCode).send(
        {
          headers: {'Access-Control-Allow-Headers': 'Authorization'},
          statusCode,
          body,
        }
  );
};


const navigationEditRestaurantLink = async (req, res) => {
    let documents;
    try {

      const restaurant = {
        msg: '',
        hasRestaurant: null,
      }

      const db = admin.firestore();

      const userId = req.body.currentUserId;

      documents = await db
      .collection('restaurants')
      .where('restaurantOwnerId', '==', userId)
      .get();

        if (documents._size > 0) {

            restaurant.msg = 'A restaurant is owned by current user';

            restaurant.hasRestaurant = true;

        } else if (documents._size <= 0) {

            restaurant.msg = 'A restaurant is not owned by current user';

            restaurant.hasRestaurant = false;
        }

        if (restaurant.hasRestaurant === true) {

          sendResponse(res, 200,
                  {

                    statusCode: 200,
                    response: restaurant,
                  }
                );
        } else {

          sendResponse(res, 200,
              {

                statusCode: 500,
                response: restaurant,
              }
            );
        }

    } catch (err) {

        sendResponse(res, 200,
        {

        statusCode: 500,
        response: 'No Resource to be found',
        error: err.message,
        data: documents,
        }
      );
    }
};


const checkIfAuthorized = async (currentUserId) => {

    let restaurantFound;

    try {

      const db = admin.firestore();

      const matches = await db
      .collection('restaurants')
      .where('restaurantOwnerId', '==', currentUserId)
      .get();


        if (matches._size > 0 && matches._size === 1) {

          restaurantFound = true;
        } else {

          restaurantFound = false;
        }

        return restaurantFound;

    } catch (err) {

     restaurantFound = err ? false : null;

     return restaurantFound;

    }



};


const retrieveFirstName = async (userId) => {

  let firstName;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection('users')
    .where('userId', '==', userId)
    .get();



      for (const document of documents.docs) {

        if (documents._size === 1) {

          firstName = document.data().firstName;
        }
      }


    return firstName;

  } catch (err) {

    console.log(err.message);
  }
};

const redirectNoRestaurant = async (req, res) => {
     try {

         const currentUserId = req.body.currentUserId;

         const firstName = await retrieveFirstName(currentUserId);

         const userIsAuthorized = await checkIfAuthorized(currentUserId);

         if (userIsAuthorized) {

          sendResponse(res, 200,
                  {
                    statusCode: 200,
                    userIsAuthorized: userIsAuthorized,

                    data: {
                      userIsAuthorized: true,
                      message: 'User is authorized to be on this page',
                      firstName,
                    }
                  }
                );
         } else {

        sendResponse(res, 401,
            {
              statusCode: 401,
              data: {
                userIsAuthorized: false,
                firstName,
                message: 'User is not authorized to be on this page',
              }
            }
          );
         }

     } catch (err) {
        sendResponse(res, 500,
          {
            statusCode: 500,
            data: {
              errorMsg: 'Something went wrong processing the request.',
            }

          }
        );
    };
}

exports.redirectnorestaurant = functions.https.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

      const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

          await redirectNoRestaurant(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);


exports.navigationeditrestaurantlink = functions.https.onRequest(
  (request, response) => {

  return cors (request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

          await navigationEditRestaurantLink(request, response);
        } else {

          response.status(403).send();
        }
   }
  );
  }
);