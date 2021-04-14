
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

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

const checkIfCurrentYear = (inputDate) => {

  const date = new Date();

  const currentYear = date
  .getFullYear()
  .toString();

  let formInputYear = '';

  const tempContainer = [];

  [...inputDate]
  .forEach(
    (char, index) => {

        if (char === '/') {

          if (tempContainer.includes('/')) {

            formInputYear = inputDate.slice(index + 1);

            } else {

              tempContainer.push(char, index);
            }
        }
      }
    );

  if (formInputYear <= currentYear) {

    return true;
  } else {

    return false;
  }
};


const formattedToSeconds = (formattedDate) => {

  const dateArray = formattedDate
  .split('/')
  .map(
    (date) => {

    return parseInt(date);
    }
  );

  let [month, day, year] = dateArray;

  const date = new Date(1970, 0, 1);

  date.setMonth(month - 1);

  date.setDate(day);

  date.setFullYear(year);

  date.setHours(0);

  date.setMinutes(0);

  date.setSeconds(1);

  return Math.round(date.getTime() / 1000);
};

const validateName = (name, regex) => {

  let error = '';

  if (name.trim().length === 0) {

    error = 'Please do not leave the name field empty';
  } else if (name.trim().length < 2) {

    error = 'Name must be a minimum of two characters';
  } else if (name.trim().length > 70) {

    error = 'Name must not exceed 70 characters';
  } else if (!regex.test(String(name))) {

    error = 'Name field can only contain lowercase and uppercase letters';
  } else if (name.split(' ').length < 2) {

    error = 'Please provide a first and last name';

  } else {

    error = '';
  }

  return error;
};

const validateEmail = (email, regex) => {

  let error = ''

  if (email.trim().length === 0) {

    error = 'Please do not leave the email field empty';
  } else if (!regex.test(String(email))) {

    error = 'Please provide a valid email address';
  } else if (email.trim().length > 170) {

    error = 'Provided email address must be less than 170 characters';

  } else {

    error = '';
  }

  return error;
};

const validateDates = (start, end, regex) => {

  let error = '';

  const regexValidation = !regex.test(String(start)) || !regex.test(String(end));

  if (start.trim().length <= 0 || end.trim().length <= 0) {

    error = 'Please make sure to provide a starting and ending date';
  } else if (regexValidation) {

    error = 'Starting and ending date must be in the format of mm/dd/yyyy or m/d/yyyy';
  } else {

    if (!checkIfCurrentYear(start) || !checkIfCurrentYear(end)) {

      error = 'The year(s) cannot be greater than the current year';
    } else if (formattedToSeconds(start) > formattedToSeconds(end)) {

      error = 'Start date may not be ahead of end date';

    } else {

      error = '';
    }
  }

  return error;
};

const validateActivity = (activity) => {

  let error = '';

  const activities = ['active', 'inactive'];

  if (activity.trim().length <= 0) {

    error = 'Please do not leave the field empty';
  } else if (!activities.includes(activity.toLowerCase())) {

    error = 'Please provide the field with either: "Active" or "Inactive"';
  } else {

    error = '';
  }

  return error;
};



const mapValidatorToForm = (form) => {

  let error = '';

  const regex = {
    nameRegex: /^[a-zA-Z_][a-zA-Z_ ]*[a-zA-Z_]$/,
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    datesRegex: /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
  }

  switch(form.marker) {

    case 'Name':

      error = validateName(form.model, regex.nameRegex);
      break;
    case 'Email':

      error = validateEmail(form.model, regex.emailRegex);
      break;
    case 'Between Dates':

      error = validateDates(form.startModel, form.endModel, regex.datesRegex);
      break;
    case 'Active/Inactive':

      error = validateActivity(form.model);
      break;

    default:
  }
  return error;
}


const extractNameFields = (fullName) => {

        const name = {};

        const splitNames = fullName.split(' ');

        console.log(splitNames);

        if (splitNames.length === 2) {

          name.firstName = splitNames[0].toLowerCase();

          name.lastName = splitNames[1].toLowerCase();
        }

        if (splitNames.length > 2) {

          name.firstName = splitNames
          .slice(0, 1)
          .join(' ')
          .toLowerCase();

          name.lastName = splitNames
          .slice(1)
          .join(' ')
          .toLowerCase();
        }

        return name;
}

const getRangeCap = () => {

  const currentDate = new Date();

  const currentDateSeconds = Math.round(currentDate.getTime() / 1000);

  const oneMonth = 2592000;

  const rangeCap = currentDateSeconds - oneMonth;

  return rangeCap;
};

const readableDate = (date) => {

  let month = date.getMonth() + 1;

  if (month < 10) {

    month = '0' + month.toString();
  }

  if (month > 12) {

    month = '01';
  }

  let day = date.getDate();

  if (day < 10) {

    day = '0' + day.toString();

  }

  const year = date.getFullYear();

  const readable = month + '/' + day + '/' + year;

  return readable;
}

const setAdditionalFields = (promises, users, user) => {

    const lastLoginDate = new Date(1970, 0, 1);

    const createdAtDate = new Date(1970, 0, 1);

    lastLoginDate.setSeconds(user.lastLogin);

    createdAtDate.setSeconds(user.createdAt.seconds);

    user.lastLoginReadableDate = readableDate(lastLoginDate);

    user.createdAtReadableDate = readableDate(createdAtDate);

    promises.push(userHasRestaurant(user, 'restaurants'));

    users.push(user);
}

const userHasRestaurant = async (user, collection) => {

  let documents;

  try {

    const db = admin.firestore();

    documents = await db
    .collection(collection)
    .where('restaurantOwnerId', '==', user.userId)
    .get();

    if (documents._size === 1) {

      user.hasRestaurant = 'Yes';

    } else {

      user.hasRestaurant = 'No';
    }

    if (user.hasRestaurant === 'Yes') {

      for (const document of documents.docs) {

        user.restaurantName = document.data().name;
      }
    }

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);
  }
};


const basicQueryTotal =  async (collection, field, operator, value) => {



  try {

    const db = admin.firestore();

    const documents =  await db
        .collection(collection)
        .where(field, operator, value)
        .select(field)
        .get();

    return documents._size;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);

    return e.message;
  }
};

 const advancedQueryTotal = async (collection, values, fields, form) => {

      let documents;

      try {

        const db = admin.firestore();

        if (form === 'dates') {

          documents = await db
            .collection(collection)
            .orderBy(fields.field1)
            .startAt(values.start)
            .endAt(values.end)
            .select('userId')
            .get();

        }

        if (form === 'names') {

          documents = await db
            .collection(collection)
            .where(fields.field1, '==', values.firstName)
            .where(fields.field2, '==', values.lastName)
            .get();
        }

        return documents._size;

      } catch (e) {

        console.log('Exception: ', e);

        console.log('Exception: ', e.message);
      }
};



const queryCollectionByName = async (model, collection, names, tempContainer, request) => {

// if else with request if its 'initial' or 'non-initial'
  tempContainer.users = [];

  tempContainer.numOfUsers = 0;

  const promises = [];

  let documents;

  try {

      const fields = {
        field1: names[0],
        field2: names[1],
      }

    const name = extractNameFields(model);

    tempContainer.numOfUsers = await advancedQueryTotal(collection, name, fields, 'names')

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where(fields.field1, '==', name.firstName)
    .where(fields.field2, '==', name.lastName)
    .limit(5)
    .get();

    for (const document of documents.docs) {

      const user = document.data();

      setAdditionalFields(promises, tempContainer.users, user);
    }

    await Promise.all(promises);

    return tempContainer;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Name: ', e.name);

    console.log('Exception Message: ', e.message);
  }
}

const queryCollectionByEmail = async (model, collection, emailField, tempContainer, request) => {
// if else with request if its 'initial' or 'non-initial'
  tempContainer.users = [];

  tempContainer.numOfUsers = 0;

  const promises = [];

  try {


    tempContainer.numOfUsers = await basicQueryTotal(collection, emailField, '==' ,model);

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .where(emailField, '==', model.toLowerCase())
    .get();

    for (const document of documents.docs) {

      const user = document.data();

      setAdditionalFields(promises, tempContainer.users, user);
    }

    await Promise.all(promises);

    return tempContainer;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Name: ', e.name);

    console.log('Exception Message: ', e.message);
  }
}

const queryCollectionByDates = async (form ,collection, createdField, tempContainer, request) => {

         tempContainer.users = [];

         tempContainer.numOfUsers = 0;

        const promises = [];

        let documents;

  try {

    const FBTimestamp = {
      start: '',
      end: '',
    };

    const fields = {
      field1: createdField,
      field2: 'createdAtSeconds',
    };

    const startDateTemp = new Date(1970, 0, 1);

    const endDateTemp = new Date(1970, 0, 1);

    startDateTemp.setSeconds(formattedToSeconds(form.startModel));

    endDateTemp.setSeconds(formattedToSeconds(form.endModel));

    FBTimestamp.start = admin.firestore.Timestamp.fromDate(startDateTemp);

    FBTimestamp.end = admin.firestore.Timestamp.fromDate(endDateTemp);

    const startSeconds = formattedToSeconds(form.startModel);

    const endSeconds = formattedToSeconds(form.endModel);


    const db = admin.firestore();


    tempContainer.numOfUsers = await advancedQueryTotal(collection, FBTimestamp, fields, 'dates');

    if (request.status === 'initial') {
        console.log('INITIAL BLOCK FIRED:::::::::::::')
         documents = await db
          .collection(collection)
          .where(fields.field2, '>', startSeconds)
          .where(fields.field2, '<', endSeconds)
          .orderBy(fields.field2, 'asc')
          .limit(5)
          .get();
    }


    if (request.status === 'non-initial') {

      documents = await db
        .collection(collection)
        .where(fields.field2, '>', startSeconds)
        .where(fields.field2, '<', endSeconds)
        .orderBy(fields.field2, 'asc')
        .startAfter(request.lastVisibleOnForm.createdAtSeconds)
        .limit(5)
        .get();
    }

    for (const document of documents.docs) {

        const user = document.data();

        user.docID = document.id;

        setAdditionalFields(promises, tempContainer.users, user);

    }

    await Promise.all(promises);

    return tempContainer;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Name: ', e.name);

    console.log('Exception Message: ', e.message);
  }
}

const queryCollectionByActivity = async (model ,collection, lastLoginField, tempContainer, request) => {

  tempContainer.users = [];

  tempContainer.numOfUsers = 0;

  const promises = [];

  let documents;

  let startPoint;

  try {

    const db = admin.firestore();

    let rangeComparison;

    if (model.toLowerCase() === 'active') {

      rangeComparison = '>';

      const dateNow = new Date();

      startPoint = Math.round(dateNow.getTime() / 1000) - 2592000;
    }

    if (model.toLowerCase() === 'inactive') {

      rangeComparison = '<';

      startPoint = 0;
    }

    const rangeCap = getRangeCap();

    tempContainer.numOfUsers = await basicQueryTotal(collection, lastLoginField, rangeComparison , rangeCap);

    if (request.status === 'initial') {

      documents = await db
      .collection(collection)
      .where(lastLoginField, rangeComparison, rangeCap)
      .orderBy(lastLoginField)
      .startAt(startPoint)
      .limit(5)
      .get();
    }

    if (request.status === 'non-initial') {

      documents = await db
      .collection(collection)
      .where(lastLoginField, rangeComparison, rangeCap)
      .orderBy(lastLoginField)
      .startAfter(request.lastVisibleOnForm.lastLogin)
      .limit(5)
      .get();

    }

    for (const document of documents.docs) {

      const user = document.data();

      setAdditionalFields(promises, tempContainer.users, user);
    }

    await Promise.all(promises);

    return tempContainer;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Name: ', e.name);

    console.log('Exception Message: ', e.message);
  }
}

const retrieveDataFromCollection = async (form, collection, request) => {

  const users = {
    result: '',
    totalUsers: 0,
    error: '',
  };

  let queryObj;

  try {

    switch(form.marker) {

      case 'Name':

        const names = ['firstName', 'lastName'];

        queryObj = await queryCollectionByName(form.model, collection, names, {}, request);

        users.result = queryObj.users;

        users.totalUsers = queryObj.numOfUsers;
        break;
      case 'Email':

        queryObj = await queryCollectionByEmail(form.model, collection, 'email', {}, request);

        users.result = queryObj.users;

        users.totalUsers = queryObj.numOfUsers;
        break;
     case 'Between Dates':

        queryObj = await queryCollectionByDates(form, collection, 'createdAt', {}, request);

        users.result = queryObj.users;

        users.totalUsers = queryObj.numOfUsers;
        break;

     case 'Active/Inactive':

          queryObj = await queryCollectionByActivity(form.model, collection, 'lastLogin', {}, request);

          users.result = queryObj.users;

          users.totalUsers = queryObj.numOfUsers;
          break;

     default:
    }

    return users;

  } catch (e) {

    data.result = '';

    data.error = e.message;

    console.log('Exception: ', e);

    console.log('Exception Name: ', e.name);

    console.log('Exception Message: ', e.message);

    return data;
  }
}

const sendAdminUserList = async (req, res) => {

      const status = {
        statusCode: null,
        errorMessage: '',
      };

  try {

    const error = mapValidatorToForm(req.body.form);

    if (error.length) {

      status.statusCode = 400;

      throw new Error(error);
    }

    const data = await retrieveDataFromCollection(req.body.form, 'users', req.body.request);

    if (data.error.length) {

      status.statusCode = 404;

      throw new Error(data.error);
    }

    sendResponse(res, 200,
      {
      exception: null,
      exceptionMessage: null,
      error: null,
      data,
      }
    );

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception: ', e.message);

    status.errorMessage = e.message;

    sendResponse(res, status.statusCode,
      {
      exception: e,
      error: status.errorMessage,
      exceptionMessage: e.message,
      data: null,
      marker: req.body.form.marker,
      }
    );
  }
};

const retrieveInitialUsers = async (collection, field, start) => {

  const users = [];

  const promises = [];

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .orderBy(field, 'asc')
    .startAt(start)
    .limit(5)
    .get();

    for (const document of documents.docs) {

      const user = document.data();

      setAdditionalFields(promises, users, user);
    }

    await Promise.all(promises);

    return users;

  } catch(e) {

    throw new Error('test this came from child func');
  }

};

const getNumOfUsers = async (collection) => {

  let totalUsers;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .limit(1)
    .get();

    for (const document of documents.docs) {

      totalUsers = document.data().total;
    }

    return totalUsers;

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);

  }
};

const initialUserList = async (req, res) => {

  try {

    const users = await retrieveInitialUsers('users', 'id', 1);

    const numOfUsers = await getNumOfUsers('num_of_users');

    sendResponse(res, 200,
      {
        data: users,
        numOfUsers,
        errorMessage: '',
      }
    );

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);

    sendResponse(res, 404,
      {
      data: null,
      errorMessage: 'Initial user data was not found',
      }
    );

  }

};

const retrieveMoreUsers = async (collection, startPos) => {


  const users = [];

  const promises = [];

  try {

    const db = admin.firestore();

    const documents = await db
    .collection(collection)
    .orderBy('id', 'asc')
    .startAfter(startPos)
    .limit(5)
    .get();


    for (const document of documents.docs) {

      const user = document.data();

      setAdditionalFields(promises, users, user);
    }

    await Promise.all(promises);

    return users;

  } catch(e) {

    console.log(' retrieveMoreUsers() Exception: ', e);

    console.log(' retrieveMoreUsers() Exception Message: ', e.message);
  }

};

const getMoreUsers = async (req, res) => {

  let users;

  try {

     const numOfUsers = await getNumOfUsers('num_of_users');

    users = await retrieveMoreUsers('users', req.body.startPos);

    sendResponse(res, 200,
      {
        error: '',
        errorMessage: '',
        data: users,
        numOfUsers,
        successMsg: 'data retrieved',
      }
    );

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);

    sendResponse(res, 404,
      {
        error: e.message,
        data: null,
        errorMessage: 'Unable to load more users at this time',
      }
    );
  }
};

const loadMoreFormResults = async (req, res) => {

  try {

    const data = await retrieveDataFromCollection(req.body.form, 'users', req.body.request);

    sendResponse(res, 200,
      {
        formSubmitted: req.body.formSubmitted,
        form: req.body.form,
        poop: req.body.request,
        message: 'success',
        data,
        error: '',
      }
    );

  } catch (e) {

    console.log('Exception: ', e);

    console.log('Exception Message: ', e.message);

    sendResponse(res, 500,
      {
        data: 'Failure',
        error: e.message,
      }
    );
  }
}

exports.sendadminuserlist = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

         const tokenVerified = await verifyUserToken(request, response);

          if (tokenVerified) {


              await sendAdminUserList(request, response);
          } else {

            response.status(403).send();
          }
      }
    )
  }
);

exports.initialuserlist = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

              await initialUserList(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

exports.getmoreusers = functions
.https
.onRequest(
  (request, response) => {

    return cors(request, response,
      async () => {

      const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

              await getMoreUsers(request, response);
      } else {

        response.status(403).send();
      }
      }
    );
  }
);

exports.loadmoreformresults = functions
.https
.onRequest(
    (request, response) => {

    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

          await loadMoreFormResults(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);

























