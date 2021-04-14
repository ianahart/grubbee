const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');


const configureResetTemplate = require('./configureResetTemplate.js');


const sendResponse = (httpMsg, statusCode, body) => {

  httpMsg
  .status(statusCode)
  .send(
      {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body,
    }
  );
};


const CheckUserInputIsEmail = (userEmail) => {

    const validation = {};

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (!emailRegex.test(String(userEmail))) {

      validation.isValid = false;

      validation.error = 'Email address format is invalid';
    } else {

      validation.isValid = true;

      validation.error = '';
    }

    return validation;
}


const checkEmailExists = async (userEmail, collection) => {

  const user = {};

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('email', '==', userEmail)
    .get();

    if (documents._size >= 1) {

      for (const document of documents.docs) {

        user.data = document.data();
      }

      user.emailExists = true;
    } else {

      user.data = null;

      user.emailExists = false;

    }

    return user;

  } catch (err) {

    console.log(err);

    console.log(err.message);

  }
};


const exitIfResetValidationFail = (res, validator, emailExists) => {

  if (!validator.isValid) {

        return sendResponse(res, 400,
          {
            data: null,
            errors: {
              email: validator.error,
              verification: null,
            }
          }
        );
    }

    if(!emailExists) {

       return sendResponse(res, 404,
        {
          data: null,
          errors: {
            email: 'Entered email is not associated with Grubbee',
            verification: null,
          },
        }
      );
    }
}


const generateRandomIndex = (min, max) => {

    return Math.floor(Math.random() * (max - 1) - min + 1) + min;
}

const makeVerificationCode = () => {

      const characters = ['1', '2' ,'3','4' ,'5' ,'6', '7' , '8', '9', '0', 'a', 'b', 'c', 'd' ,'e', 'f', 'g', 'h', 'i', 'j', 'k','l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't' ,'u' ,'v' ,'w', 'x', 'y', 'z'];

      let verificationCode = [];

      for (let i = 0; i < 6; i++) {

        const randomIndex = generateRandomIndex(0, characters.length);

        verificationCode.push(characters[randomIndex]);
      }

      return verificationCode.join('');
}

const deletePrevResetFromCollection = async (currentUserId, collection) => {

  let operations = [];

  try {
    console.log(currentUserId, collection);
    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('userId', '==', currentUserId)
    .get();

    for (const document of documents.docs) {

      const docID = document.id;

      const docToDelete = db.collection(collection).doc(docID).delete();

      operations.push(docToDelete)
    }

    await Promise.all(operations);

  } catch (err) {

    console.log(`Error: ${err}`);

    console.log(`Error Message: ${err.message}`);
  }

}

const sendResetPasswordEmail = async (appURL, recipient) => {

  const data = {};

  try {

    const token = uuidv4();

    const urlToken = appURL + '?token=' + token;

    const verificationCode = makeVerificationCode();

    const html = configureResetTemplate(urlToken, recipient.firstName, verificationCode);

    const message = {

      from: functions.config().nodemailer.user,
      to: recipient.email,
      subject: 'Password Reset:',
      html,
    }

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

    let info = await transporter.sendMail(message);

    data.mailerResponse = info;

    data.verificationCode = verificationCode;

    data.token = token;

    return data;

  } catch (err) {

    console.log(`Error: ${err}`);

    console.log(`Error Message: ${err.message}`);

  }
};


const addPasswordResetToCollection = async (userId, collection, verificationCode, token) => {

  try {

    const date = new Date();

    const seconds = Math.round(date.getTime() / 1000);

    const db = admin.firestore();

    const document = {
      userId,
      verification_code: verificationCode,
      createdAt: seconds,
      id: uuidv4(),
      token,
    }

    await db.collection(collection).add(document);

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);

  }
}

const sendForgotPasswordEmail = async (req, res) => {

  try {

    const validator = CheckUserInputIsEmail(req.body.userEmail);

    const user = await checkEmailExists(req.body.userEmail, 'users');


    if (!validator.isValid || !user.emailExists) {

       return exitIfResetValidationFail(res, validator, user.emailExists);
    }


    const emailStatus = await sendResetPasswordEmail(req.body.appURL, user.data);

    await deletePrevResetFromCollection(user.data.userId, 'password_resets');

    await addPasswordResetToCollection(user.data.userId, 'password_resets', emailStatus.verificationCode, emailStatus.token);

    if(emailStatus.mailerResponse.messageId.length) {

        sendResponse(res, 200,
          {
            error: null,
            data: emailStatus,
            userId:user.data.userId,
            successMessage: 'Email has been sent to ' + emailStatus.mailerResponse.accepted.join(''),
          }
        );
    }

  } catch (err) {

    console.log(`Error: ${err}`);

      console.log(`Error Message: ${err.message}`);

    sendResponse(res, 500,
      {
        errorMessage: 'Internal Server Error',
        error: err,
        data: null,
      }
    );
  }
};

// -----------------------------------------------------------------------------------------------

const verifyUserVerificationCode = async (currentUserId, inputs, collection) => {

  try {

    let verificationCodeInDB;

    let matches;

    const { newPassword, verificationCode } = inputs;

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('userId', '==', currentUserId)
    .get();

    if (documents._size === 1) {

      for (const document of documents.docs) {

        verificationCodeInDB = document.data().verification_code;
      }
    }


    if (verificationCodeInDB === verificationCode.model) {

      matches = true;

    } else {

      matches = false;
    }

    return matches;

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);

  }
};


const checkPasswordInclusions = (password) => {

  let number = false,
      uppercase = false,
      lowercase = false;

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

    if (number && uppercase && lowercase) {

      return true;
    } else {

      return false;
    }
}

const validateNewPassword = ({ newPassword }) => {

  const validation = {};

  if (newPassword.model.length < 6) {

    validation.error = 'Password must be more than 6 characters';

    validation.passed = false;
  } else if (!checkPasswordInclusions(newPassword.model)) {

    validation.error = 'Password must include at least 1 uppercase character, 1 lowercase character, and 1 number';

    validation.passed = false;
  } else {

    validation.passed = true;

    validation.error = '';
  }

  return validation;
};


const updateUserPassword = async (currentUserId, form, collection) => {

  try {

    const operations = [];

    const auth = admin.auth;

    const db = admin.firestore();

    /*
    if non existent userId is used it will return a 422 to client
    */
    const userRecord = await auth().updateUser(currentUserId, { password: form.newPassword.model });

    if (Object.keys(userRecord.toJSON()).length) {

      const documents = await db
      .collection(collection)
      .where('userId', '==', currentUserId)
      .get();

      for (const document of documents.docs) {

        let documentID = document.id;

        const operation = db
        .collection(collection)
        .doc(documentID)
        .delete();

        operations.push(operation);
      }

      await Promise.all(operations);
    }

    return true;

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);
  }
}


const verifyAndChangePassword = async (req, res) => {

  const status = {

      statusCode: '',
      fieldError: '',
    };


  try {

    const { userId, form } = req.body;

    const verificationCodePasses = await verifyUserVerificationCode(userId, form, 'password_resets');

    if (verificationCodePasses) {

      validator = validateNewPassword(form);

    } else {

      status.statusCode = 401;

      status.fieldError = 'verificationCode';

      throw new Error('Verification code does not match the one we sent you');
    }

    if (validator.passed) {

      passwordUpdated = await updateUserPassword(userId, form, 'password_resets');
    } else {

      status.statusCode = 400;

      status.fieldError = 'newPassword';

      throw new Error(validator.error)
    }

    if (passwordUpdated) {

      return sendResponse(res, 200,
          {
            error: null,
            errorMessage: '',
            successMessage: 'Password has been successfully updated',
          }
        );
    } else {

      status.statusCode = 422;

      status.fieldError = 'main';

      throw new Error('Unable to change password at this time please contact support, or try again later.');
    }

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);

    if(status.statusCode === '' && status.fieldError === '') {

      status.statusCode = 500;

      err.message = 'Unable to change password at this time please contact support, or try again later.';
    }

    sendResponse(res, status.statusCode,
      {
      errorLocation: status.fieldError,
      errorMessage: err.message,
      data: null,
      }
    );
  }
};

const confirmTokenIsValid = async (resetToken, collection) => {

  let token = {};

  let tokenDoc;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where('token', '==', resetToken)
    .get();

    for (const document of documents.docs) {

      tokenDoc = document.data();
    }

    const date = new Date();

    const oneDay = 86400;

    const nowInSeconds = Math.round(date.getTime() / 1000);

    const elapsedTime = nowInSeconds - tokenDoc.createdAt;


    if(elapsedTime < oneDay) {

      token.isValid = true;

      token.userId = tokenDoc.userId;

      token.remainingTime = nowInSeconds - elapsedTime;

    } else {

      token.isValid = false;

      token.userId = tokenDoc.userId;
    }

    return token;

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message)

  };
};

const checkResetPasswordToken = async (req, res) => {

  try {

    const token = await confirmTokenIsValid(req.body.resetToken, 'password_resets');

    if (token.isValid) {

    sendResponse(res, 200,
        {
          data: token,
          errorMessage: '',
        }
      );
    } else {

    sendResponse(res, 401,
      {
        data: token,
        errorMessage: 'This link has expired. You will need to reload the page and send reset again.',
      }
    );
    }

  } catch (err) {

    console.log('Error: ', err);

    console.log('Error Message: ', err.message);

    sendResponse(res, 500,
      {
        data: null,
        errorMessage: err.message,
        error: err,
      }
    );
  }
};

exports.sendforgotpasswordemail = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response, async () => {

      await sendForgotPasswordEmail(request, response);
     }
    );
  }
);

exports.verifyandchangepassword = functions
.https.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        await verifyAndChangePassword(request, response);
      }
    );
  }
);

exports.checkresetpasswordtoken = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

      await checkResetPasswordToken(request, response);
      }
    );
  }
);

