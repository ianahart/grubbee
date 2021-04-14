const functions = require("firebase-functions");
const admin = require('firebase-admin');

module.exports = async (req, res) => {

  let isVerified;

  try {

    if (req.headers.authorization.startsWith('Bearer ')) {

      const idToken = req.headers.authorization.split('Bearer ')[1];

      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (decodedToken) {

        isVerified = true;
      } else {

        isVerified = false;
      }

    }

    return isVerified;

  } catch(e) {

    console.log('Exception: ', e);

    isVerified = false;

    return isVerified;
  }

};