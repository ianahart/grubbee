const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const verifyUserToken = require('./verifyUserToken');


const sendResponse = (httpMsg, statusCode, body) => {

  httpMsg
  .status(statusCode)
  .send(
    {
      headers: {'Access-Control-Allow-Origin': '*'},
      body,
    }
  );
};

const encryptNewPassword = async (newPassword) => {

  try {

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return hashedPassword;

  } catch (err) {

    console.log(err);
  }
}


const newAndOldIdentical = (password, newPassword) => {


  if (password.model.toLowerCase() === newPassword.model.toLowerCase()) {

    return true;
  } else {

    return false;
  }
};

const newPasswordRequirements = (password) => {

   let uppercase = false,
       lowercase = false,
       number = false;


       password
       .split('')
       .forEach(
         (character) => {

          if (character === character.toLowerCase()) {

             lowercase = true;
          }

          if (character === character.toUpperCase() && isNaN(character)) {

            uppercase = true;
          }

          if (!isNaN(parseInt(character))) {

            number = true;
          }
         }
       );

      if (uppercase && lowercase && number) {

        return true;
      } else {

        return false;
      }
};

const validatePasswordChange = async (inputs) => {


    const formData = {

      errorsPresent: null,
      formInputs: null,
    }

    try {

      if (inputs.currentPassword.model.length < 6) {

            inputs.currentPassword.error = 'Current password must be a minimum of 6 characters';
          }

          if (inputs.newPassword.model.length < 6) {

            inputs.newPassword.error = 'New password must be a minimum of 6 characters';
          } else if (newAndOldIdentical(inputs.currentPassword, inputs.newPassword)) {

            inputs.newPassword.error = 'New password cannot be the same as your old password';
          } else if (!newPasswordRequirements(inputs.newPassword.model)) {

            inputs.newPassword.error = 'New password must contain at least: 1 lowercase, 1 uppercase, and 1 digit characters';
          }

          if (inputs.confirmPassword.model.length < 6) {

            inputs.confirmPassword.error = 'Confirm password must be a minimum of 6 characters';
          }  else if (inputs.confirmPassword.model !== inputs.newPassword.model) {

            inputs.confirmPassword.error = 'Confirmed password does not match your new password';
          }

        const errorsPresent = checkErrorsPresent(inputs);

        formData.errorsPresent = errorsPresent;

        inputs.newPassword.hashedPassword = await encryptNewPassword(inputs.newPassword.model);

        inputs.newPassword.model = '';

        formData.formInputs = inputs;

        return formData;
    } catch (err) {

      console.log(err);

      console.log(err.message);
    }


};


const checkErrorsPresent = (data) => {

  let errorOccurrence = false;

  for (let field in data) {

    for (let property in data[field]) {

      if (property === 'error') {

        if (data[field][property].length > 0) {

          errorOccurrence = true;
        }
      }
    }
  }

  return errorOccurrence;
};

const changePasswordValidation = async (req, res) => {

  try {

    const form = await validatePasswordChange(req.body.formInputs);

    if (form.errorsPresent) {

      sendResponse(res, 422,
        {

        error: form.errorsPresent,
        message: 'validation failed',
        data: form.formInputs,
        }
      );
    } else {

      sendResponse(res, 200,
        {

        error: form.errorsPresent,
        message: 'success',
        data: form.formInputs,
        }
      );
    }

  } catch (err) {
    sendResponse(res, 500,
      {

      error: 'Internal Server Error: (something went wrong)',
      message: 'Failure',
      data: null,
      }
    );
  }
};



const fetchUserEmail = async (currentUserId, collection) => {

  let userEmail;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('userId', '==', currentUserId)
    .get();

    for (const document of documents.docs) {

      if (documents.docs.length === 1) {

          userEmail = document.data().email;
      }
    }

    return userEmail;

  } catch(err) {

    return undefined;
  }

};

const respondWithUserEmail = async (req, res) => {


  try {

    const userEmail = await fetchUserEmail(req.body.currentUserId, 'users');

    if (userEmail === undefined) {

      throw new Error('Cannot match user. Please come back later.');
    }

    sendResponse(res, 200,
      {

      data: userEmail,
      message: 'success',
      error: null,
      }
    );

  } catch (err) {

    sendResponse(res, 500,
      {

      data: null,
      message: 'failure',
      error: err.message,
      }
    );


  }
};


const verifyNewPassword = async (plainTextPassword, hashedPassword) => {

  try {

    const result = await bcrypt
    .compare(plainTextPassword, hashedPassword);

    return result;

  } catch (err) {

    console.log(err);

  }
};


const passwordChangeElapsedTime = async (currentUserId, collection) => {

  const time = {};

  let passwordChangeData;

  let passwordChangeDocID;

  try {

    const now = new Date();

    const currentTimeInSeconds = Math.round(now.getTime() / 1000);

    const waitTime = 86400;

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('userId', '==', currentUserId)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

        passwordChangeData = document.data();

        passwordChangeDocID = document.id;
      }
    }


    const timeElapsed = currentTimeInSeconds - passwordChangeData.createdAt;

    if (timeElapsed > waitTime) {

        time.enoughTimePassed = true;

        time.timeElapsed = timeElapsed;

        await db
        .collection(collection)
        .doc(passwordChangeDocID)
        .delete();

    } else {

       const wait = 86400 - timeElapsed;

       const hour = ((wait - wait % 3600) / 3600) % 60;

       const minutes =  ((wait - wait  % 60) / 60) % 60;

       time.enoughTimePassed = false;

       time.timeElapsed = timeElapsed;

       time.remainingTime = `${hour}hr ${minutes}mins`;
    }

    return time;

  } catch (err) {


    console.log('Error: ', err);

    console.log('Error Message ', err.message);
  }
};

const addPasswordChangeToCollection = async (currentUserId, collection) => {

  try {
    console.log('addPasswordChangeToCollection fired');
    const now = new Date();

    const todayInSeconds = Math.round(now.getTime() / 1000);

    const db = admin.firestore();

    const result = await db
    .collection(collection)
    .add(
      {
        userId: currentUserId,
        createdAt: todayInSeconds,
        id: uuidv4(),
      }
    );

    if (result.id) {

      return true;
    } else {

      return false;
    }

  } catch (err) {
console.log('addPasswordChangeToCollection fired but error');
    console.log('Error: ', err);

    console.log('Error Message: ', err.message);
  }

}

const updateUserPassword = async (currentUserId, newPassword) => {

  try {

    const auth = admin.auth();

    const result = await auth.updateUser(currentUserId, { password: newPassword });

    return result.toJSON();

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);
  }
};

const userActionChangePassword = async (req, res) => {

  let result;

  let passwordChangedSuccess = false;

  try  {

      const isVerified = await verifyNewPassword(req.body.newPassword, req.body.hashedPassword);

      const time= await passwordChangeElapsedTime(req.body.currentUserId, 'password_changes');


      if (isVerified && time.enoughTimePassed) {

        result = await updateUserPassword(req.body.currentUserId, req.body.newPassword);

        if (Object.keys(result).length) {

          passwordChangedSuccess = true;

          await addPasswordChangeToCollection(req.body.currentUserId, 'password_changes');

        }

      } else {

       return sendResponse(res, 400,

          {
            error: 'You need to wait a 24 hours (1 day) in order to change your password again',
            data: null,
            passwordChangedSuccess,
            time
          }
        );
      }

    sendResponse(res, 200,

      {

      error: null,
      data: null,
      message: 'Success',
      passwordChangedSuccess,
      time,
      }
    );

  } catch (err) {
    console.log(err);

    console.log(err.message);
    sendResponse(res, 500,
      {

      error: 'Internal Server Error',
      data: null,
      message: 'Failure',
      passwordChangedSuccess
      }
    );
  }
}


exports.changepasswordvalidation = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {


          await changePasswordValidation(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

exports.respondwithuseremail = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {


          await respondWithUserEmail(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

exports.useractionchangepassword = functions
.https.
onRequest(
    (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {


          await userActionChangePassword(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

