const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
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

const getCustomerRestaurant = async (customerId, tableName) => {

  const customerRestaurant = {};

  try {

    const db = admin.firestore();

    // test 404 error by using fake customerId

    const documents = await db
    .collection(tableName)
    .where('restaurantOwnerId', '==', customerId)
    .get();

    if (documents._size !== 1) {

      throw new Error('There was a problem finding your restaurant. Please try again.');
    }


    for (const document of documents.docs) {

      customerRestaurant.data = document.data();

      customerRestaurant.error = '';
    }



    return customerRestaurant;

  } catch (err) {

    customerRestaurant.data = null;

    customerRestaurant.error = err.message;

    return customerRestaurant;
  }
};


const addCustomerTestimonial = async (testimonial, tableName) => {
      // switch testimonial with undefined to test against no document added error
  let result = {};

  try {

    const db = admin.firestore();

      result.data = await db.collection(tableName).add(testimonial);

      result.error = '';

      return result;

  } catch (err) {

    result.data = null;

    result.error = 'Unable to add testimonial at this time. Try again soon';



   return result;

  }
};


const validateTestimonial = (testimonial) => {

  const alphaNumericRegex = /^[\w\s.-]+$/i;

  let errors = [];

  if (testimonial.trim().length === 0) {

    errors.push('Testimonial cannot be empty');
  }

  if (testimonial.trim().length > 150) {

    errors.push('Testimonial cannot be longer than 150 characters');
  }

  if (testimonial.split(' ').length < 5) {

    errors.push('Testimonial must be at least 5 words');
  }

  if (!alphaNumericRegex.test(String(testimonial))) {

    errors.push('Please use only alpha-numeric characters');
  }

  if (errors.length) {

    return errors;
  } else {

    return [];
  }

}

const handleAddTestimonial = async (req, res) => {

  try {

    const testimonialText = req.body.testimonialInput;

    const {data, error} = await getCustomerRestaurant(req.body.currentUserId, 'restaurants');

      if (error.length) {

        throw new Error(error)
      }

    const {name, id, restaurantOwnerId, firstName} = data;

    const formErrors = validateTestimonial(testimonialText);

    if (formErrors.length > 0) {

      throw ({ errors: formErrors, status: 400 });
    }

    const document = {

      createdAt: Math.round(new Date().getTime() / 1000),
      customerId: restaurantOwnerId,
      restaurantId: id,
      restaurant_name: name,
      restaurant_owner_name: firstName,
      testimonial: testimonialText,
    };

    const result = await addCustomerTestimonial(document, 'customer_testimonials');

    if (result.error.length) {

      throw ({ errors: [result.error], status: 400 });
    }

    sendResponse(res, 200,
      {
      status: 200,
      error: null,
      message: 'success',
      }
    );

  } catch (err) {

    if (err.status === 400) {

      sendResponse(res, err.status,
        {
        status: err.status,
        errors: err.errors,
        message: 'invalid form',
        data: null,
        }
      );

    } else {

    sendResponse(res, 404,
        {
        status: 404,
        error: err,
        message: err.message,
        data: null,
        }
      );
  }

  }
};


const checkCustomerForTestimonial = async (customerId, tableName) => {

  // check use undefined in where query to trigger error for testimonial component

  const customer = {};

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .where('customerId', '==', customerId)
    .get();

    if (documents._size > 0) {

     customer.customerHasTestimonial =  true;

     customer.error = '';
    } else {
     customer.customerHasTestimonial =  false;

     customer.error = '';
    }

    return customer;

  } catch (err) {

    customer.customerHasTestimonial = null,

    customer.error = 500;

    return customer;
  }
}

const setupTestimonial = async (req, res) => {

  try {

      const customerHasTestimonial = await checkCustomerForTestimonial(req.body.currentUserId, 'customer_testimonials');

      if (customerHasTestimonial.error === 500) {

        throw ({status: customerHasTestimonial.error, message: 'Cannot load testimonial section'});
      }

      sendResponse(res, 200,
        {
        statusCode: 200,
        error: '',
        data: {
          hasTestimonial: customerHasTestimonial.customerHasTestimonial,
        }
        }
      );
  } catch (err) {

    sendResponse(res, 500,
        {
        statusCode: err.status,
        error: 'hihihihihi',
        data: null,
        }
    );
  }
};


const getTestimonials = async (tableName, todaySeconds) => {

  const testimonials = {
    error: '',
    data: [],
  };

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .orderBy('createdAt', 'desc')
    .startAt(todaySeconds)
    .limit(4)
    .get();

    if (documents._size === 0) {

      throw 'No testimonials found';
    }

    for (const document of documents.docs) {

      testimonials.data.push(document.data());
    }

    testimonials.error = '';

    return testimonials;

  } catch (err) {

    testimonials.error = err;

    testimonials.data = [];

    return testimonials;
  }
}

const loadTestimonials = async (req, res) => {

  try {

    const date = new Date();

    const todaySeconds = Math.round(date.getTime() / 1000);

    const testimonials = await getTestimonials('customer_testimonials', todaySeconds);

    if (testimonials.data.length === 0) {

      throw({error: testimonials.error, status: 500});
    }

    sendResponse(res, 200,
      {

      error: testimonials.error,
      data: testimonials.data,
      }
    );
  } catch (err) {

    sendResponse(res, 500,
      {

      error: err,
      status:err.status,
      }
    );
  }

}


exports.addtestimonial = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

            await handleAddTestimonial(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

exports.setuptestimonial = functions
.https
.onRequest(
  (request, response) => {

  return cors (request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

      await setupTestimonial(request, response);
    } else {

      response.status(403).send();
    }
    }
   );
  }
);

exports.loadtestimonials = functions
.https
.onRequest(
  (request, response) => {

    return cors (request, response,
       async () => {

      await loadTestimonials(request, response);
      }
    );
  }
);