
const { storage } = require('firebase-admin');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const { nanoid } = require('nanoid');
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


const removePrevImageInStorage = async (fileName) => {

  try {

    const bucket = admin.storage().bucket();

    const fileExists = await bucket.file(fileName).exists();

    if (fileExists) {

      const file = bucket.file(fileName);

      await file.delete();
    }

  } catch (err) {

  }
}


const getRestaurantInformation = async (currentUserId) => {

  const restaurant = {};

  try {

      const db = admin.firestore();

      const documents = await db
      .collection('restaurants')
      .where('restaurantOwnerId', '==', currentUserId)
      .get();

      if (documents._size === 1) {

        for (const document of documents.docs) {

          restaurant.data = document.data();

          restaurant.exists = true;
        }
      } else {

        restaurant.data = null,

        restaurant.exists = false;
      }

      return restaurant;

  } catch (err) {

    console.log(err.message);
  }
};

const checkForAdmin = async (currentUserId) => {

  let isAdmin = null;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection('users')
    .where('userId', '==', currentUserId)
    .get();

    for (const document of documents.docs) {

      if (document.data().isAdmin) {

        isAdmin = true;
      } else {

        isAdmin = false;
      }
    }

    return isAdmin;

  } catch (err) {

    throw err;
  }
};


const sendRestaurantInformation = async (req, res) => {

  try {

    const isAdmin = await checkForAdmin(req.body.currentUserId);

    const restaurantInformation = await getRestaurantInformation(req.body.currentUserId);

    sendResponse(res, 200,
      {
      statusCode: 200,
      restaurant: restaurantInformation,
      isAdmin,
      }
    );

   } catch (err) {

    sendResponse(res, 200,
          {
          statusCode: 404,
          data: null,
          error: err,
          }
        );
   }
};

const updateImgInTable = async (fileURL, restaurantId, tableName, field, fileName = '') => {

  let prevFileName;

  let docID;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .where(field, '==', restaurantId)
    .get();

    for (const document of documents.docs) {

      if (tableName === 'restaurants') {

        prevFileName = document.data().image_file_name;

      }

      docID = document.id;
    }

    const docRef = db
    .collection(tableName)
    .doc(docID);

    if(tableName === 'restaurants') {

      await docRef.update(
          {
            image_url: fileURL,
            image_file_name: fileName,
          }
        );
    }

    if (tableName === 'favorites') {

          await docRef.update(
        {
          image_url: fileURL,
        }
      );
    }

    return prevFileName;
  } catch (err) {
    throw `${err}---- image update unavailable`;
  };
};


const downloadFileURL = async (fileName, token) => {


  try {

    const bucket = 'grubbee-6161e.appspot.com';

    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      fileName
    )}?alt=media&token=${token}`;
} catch (err) {

    throw `${err}-----------Problem downloading file URL`;
  }
};


const validateImageBuffer = (fileInfo, bufferLen) => {

  const validationObj = {};
  // 2GB
  const maxFileSize = 2000000;

  const webSafeTypes = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

    const imageTypeAccepted = webSafeTypes
    .findIndex(
      (type) => {

        return fileInfo.fileType === type;
      }
    );

    if (bufferLen > maxFileSize) {

        validationObj.errorMessage = `${fileInfo.fileName} is too large of a file (Max 2MB)`;

        validationObj.status = false;
    } else if (imageTypeAccepted <= -1) {

      validationObj.errorMessage = `${fileInfo.fileName} has to of one of the following types: gif, jpeg, png, webp`;

      validationObj.status = false;
    } else {

      validationObj.status = true;

      validationObj.errorMessage = null;
    }

   return validationObj;
};

const sendToStorage = async (data) => {

  const imageToBeStored = {};

  try {

    const bucket = admin.storage().bucket();

    const base64Image = data.base64EncodedImg.split(',')[1];

    const imageBuffer = Buffer.from(base64Image, 'base64');

    const bufferLength = imageBuffer.toString().length;

    const validation = validateImageBuffer(data, bufferLength);

    if (!validation.status) {

      imageToBeStored.bufferValidated = false;

      imageToBeStored.error = validation.errorMessage;

    } else {

      imageToBeStored.bufferValidated = true;

      imageToBeStored.error = null;
    }
    const token = nanoid();

    const options = {

      metadata: {

        contentType: data.fileType,

        metadata: {

          firebaseStorageDownloadTokens: token,
        },
      },
    };

      if (imageToBeStored.bufferValidated) {

          const file = bucket.file(data.fileName);

          await file.save(imageBuffer, options);

          imageToBeStored.fileURL =  await downloadFileURL(data.fileName, token);

          const prevImageFileName = await updateImgInTable(imageToBeStored.fileURL, data.restaurantId, 'restaurants', 'id', data.fileName);

          await updateImgInTable(imageToBeStored.fileURL, data.restaurantId, 'favorites', 'restaurantId');

          await removePrevImageInStorage(prevImageFileName);
      }

      return imageToBeStored;

  } catch (err) {

    throw `${err}-------Unable to save file`;

  }
};

const handleFileUpload = async (req, res) => {

  try {

    const storageResult =  await sendToStorage(req.body);

    if (storageResult.bufferValidated) {

      sendResponse(res, 200,
        {
          statusCode: 200,
          error: storageResult.error,
          URL: storageResult.fileURL,
        }
      );
    } else {

      sendResponse(res, 200,
        {
          statusCode: 400,
          error: storageResult.error,
          URL: null,
        }
     );
    }

  } catch (err) {

  sendResponse(res, 200,
      {
        statusCode: 500,
        data: null,
        error: err,
      }
    );
  }
};

const updateRestaurant = async (data, currentUserId, tableName) => {

  let docID;
  let result;

  try {

    if (data.state !== data.state.toUpperCase()) {

        data.state = data.state
        .split(' ')
        .map(
          (character) => {

          return character.toUpperCase();
           }
         )
        .join('');
    }

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .where('restaurantOwnerId', '==', currentUserId)
    .get();

      if (documents._size > 0) {

        for (const document of documents.docs) {

              docID = document.id;

              const docRef = db.
              collection(tableName)
              .doc(docID);

              result = await docRef.update(data);
          }
      } else {

        throw 'No resource to be updated';
      }

      if (result._writeTime._seconds > 0) {

        return result;
      }

  } catch (err) {

    throw err;
  }
};

const checkForErrors = (form) => {

  let errors = false;

    for (let field in form) {

      for (let property in form[field]) {

        if (property === 'inputError') {

            const error = form[field][property];

            if (error.length >= 0) {

                errors = true;
            }
        }
      }
    }

    return errors;
};

const testAgainstRegex = (regex, fieldValue) => {

  return regex.test(String(fieldValue))

};

const validatePhoneNumber = (input) => {

  let notAllDigits = false;

  const result = input
  .split('')
  .filter(
    (char) => {

    if (!isNaN(parseInt(char)) || char === '-') {
      return;
    } else {

      notAllDigits = true;
    }
     }
  );

  if (notAllDigits === true) {

    return true;
  } else {

    return false;
  }
}

const validateFormData = async (req) => {

  try {

    const regex = {

        string: /^[\w\s.-]+$/i,

        lettersOnly: /^[\w\s.-]+$/i,

        phone: /[0-9\(\)-]*/,

        numbers: /^[0-9-]+$/,
    };

    const { updateObj } = req.body;

    const { currentUserId } = req.body;

    const { formData } = req.body;

    // FIRST NAME
    if (formData.firstName.inputModel.length === 0) {

        formData.firstName.inputError = 'First name cannot be empty';
    } else if(formData.firstName.inputModel.length <= 1) {

        formData.firstName.inputError = 'First name must be at least 2 characters';

    } else  if (formData.firstName.inputModel.length > 60) {

        formData.firstName.inputError = 'First name must be less than 60 characters';
    } else if (!testAgainstRegex(regex.string, formData.firstName.inputModel)) {

        formData.firstName.inputError = 'Please do not use special characters other than underscores';
    }

    // LAST NAME
    if (formData.lastName.inputModel.length === 0) {

      formData.lastName.inputError = 'Last name cannot be empty';
    } else if(formData.lastName.inputModel.length <= 1) {

      formData.lastName.inputError = 'Last name must be at least 2 characters';
    } else  if (formData.lastName.inputModel.length > 60) {

      formData.lastName.inputError = 'Last name must be less than 60 characters';
    } else if (!testAgainstRegex(regex.string, formData.lastName.inputModel)) {

      formData.lastName.inputError = 'Please do not use special characters other than underscores';
    }

    // RESTAURANT NAME
    if (formData.restaurantName.inputModel.length === 0) {

      formData.restaurantName.inputError = 'Restaurant Name cannot be empty';
    } else if (formData.restaurantName.inputModel.length <= 1) {

      formData.restaurantName.inputError = 'Restaurant Name must be at least 2 characters';
    } else if (formData.restaurantName.inputModel.length > 50) {

      formData.restaurantName.inputError = 'Restaurant name must be less than  50 characters';
    } else if (!testAgainstRegex(regex.string, formData.restaurantName.inputModel)) {

      formData.restaurantName.inputError = 'Please do not use special characters other than underscores';
    }

    // RESTAURANT PHONE
   if (formData.restaurantPhone.inputModel.length === 0) {

      formData.restaurantPhone.inputError = 'Restaurant phone cannot be empty';
    } else if (formData.restaurantPhone.inputModel.length) {

      const justDigits = formData.restaurantPhone.inputModel
      .split('')
      .filter(
        (character) => {

        return character !== '-';
      })
      .join('');

      if (justDigits.length < 9 || justDigits.length > 14) {

        formData.restaurantPhone.inputError = 'Restaurant phone must be between 9 and 14 digits';
      } else if (validatePhoneNumber(formData.restaurantPhone.inputModel)) {

        formData.restaurantPhone.inputError = 'Restaurant Phone number can only be digits and dashes';
      }

     } else if (!testAgainstRegex(regex.numbers, formData.restaurantPhone.inputModel)) {

      formData.restaurantPhone.inputError = 'Restaurant phone can only include numbers and hyphens';
    }

    // restaurantAddress
    if (formData.restaurantAddress.inputModel.length === 0) {

      formData.restaurantAddress.inputError = 'Restaurant address cannot be empty';
    } else if (formData.restaurantAddress.inputModel.length < 5) {

      formData.restaurantAddress.inputError = 'Restaurant address must be at least 5 characters';
    } else if (formData.restaurantAddress.inputModel.length > 70) {

      formData.restaurantAddress.inputError = 'Restaurant address must be less than  70 characters';
    } else if (!testAgainstRegex(regex.string, formData.restaurantAddress.inputModel)) {

      formData.restaurantAddress.inputError = 'Please do not use special characters other than underscores';
    }

    if (formData.restaurantAddress.inputModel.length === 0) {

      formData.restaurantAddress.inputError = 'Restaurant address cannot be empty';
    } else if (formData.restaurantAddress.inputModel.length < 5) {

      formData.restaurantAddress.inputError = 'Restaurant address must be at least 5 characters';
    } else if (formData.restaurantAddress.inputModel.length > 70) {

      formData.restaurantAddress.inputError = 'Restaurant address must be less than  70 characters';
    } else if (!testAgainstRegex(regex.string, formData.restaurantAddress.inputModel)) {

      formData.restaurantAddress.inputError = 'Please do not use special characters other than underscores';
    }

    if (formData.state.inputModel.length === 0) {

      formData.state.inputError = 'State cannot be empty';
    } else if (formData.state.inputModel.length > 2 && formData.state.inputModel.length !== 0) {

      formData.state.inputError = 'State must be abbreviated and exactly 2 characters';
    }  else if (formData.state.inputModel.length === 2) {

          let onlyLetters = true;

          formData.state.inputModel
          .split('')
          .forEach(
            (char) => {

              if (isNaN(parseInt(char))) {

                return;
              } else {

                onlyLetters = false;
                return;
              }
             }
          );

          if (!onlyLetters) {

            formData.state.inputError = 'State only allows letters as characters';
          }
    }


 if (formData.zipCode.inputModel.length === 0) {

      formData.zipCode.inputError = 'Zip code cannot be empty';
    } else if (formData.zipCode.inputModel.length > 5) {

      formData.zipCode.inputError = 'Zip code must be exactly 5 digits';

    } else if (formData.zipCode.inputModel.length === 5) {

      let allNumbers = true;

      formData.zipCode.inputModel
      .split('').forEach(
        (char) => {

          if (isNaN(parseInt(char))) {

              allNumbers = false;
          }
          if (!allNumbers) {

            formData.zipCode.inputError = 'Zip code only accepts digits as characters';
          }
        }
       );
    }

    const formErrors = checkForErrors(formData);

    if (!formErrors) {

      await updateRestaurant(updateObj, currentUserId, 'restaurants');

      await updateRestaurant(updateObj, currentUserId, 'favorites');

    } else {

      return formData;
    }

  } catch (err) {

    throw err;
  }
};

const sendValidationResponse = async (req, res) => {

  try {

     const formErrors = await validateFormData(req);

     if(formErrors) {

      sendResponse(res, 200,
            {
              statusCode: 400,
              errors: formErrors,
              updateSuccess: false,
            }
          );
     } else {

      sendResponse(res, 200,
          {
            statusCode: 200,
            data: null,
            updateSuccess: true,
          }
        );
     }

  } catch (err) {

    sendResponse(res, 200,
      {
        statusCode: 500,
        errorMessage: err.message,
        error: err,
        result: null,
      }
    );
  }

};

exports.handlefileupload = functions.https.onRequest(
  (request, response) => {

  return cors(request, response,
    async () => {

      const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

        await handleFileUpload(request, response);
      } else {

        response.status(403).send();
      }
     }
    );
  }
);



exports.getrestaurantinformation = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

          await sendRestaurantInformation(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
   }
);

exports.validateformdata = functions
.https.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

          await sendValidationResponse(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);