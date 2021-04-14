const path = require('path');

const stripePayment = require('./stripePayment.js');
const addRestaurant = require('./AddRestaurant.js');
const sendConfirmationEmail = require('./sendConfirmationEmail.js');
const sendRefundEmail = require('./sendRefundEmail.js');
const navigationEditRestaurantLink = require('./navigationEditRestaurantLink.js');
const stripeRefund = require('./stripeRefund.js');
const editRestaurantFormActions = require('./editRestaurantFormActions.js');
const deleteRestaurant = require('./deleteRestaurant.js');
const adminTransactions = require('./adminTransactions.js');
const testimonials = require('./testimonials');
const transactionsPDF = require('./transactionsPDF');
const passwordActions = require('./passwordActions');
const forgotPassword = require('./forgotPassword.js');
const adminUserListActions = require('./adminUserListActions.js');
const deleteAccount = require('./deleteAccount.js');


const functions = require("firebase-functions");
const admin = require('firebase-admin');


const serviceAccount = path.resolve(__dirname, functions.config().cred.account)

admin.initializeApp(
    {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: functions.config().fb.iambucket,
    databaseURL: functions.config().fb.database,
    }
);

exports.charge = stripePayment.charge;//DONE

exports.addrestaurant = addRestaurant.addrestaurant; // DONE

exports.sendconfirmationemail = sendConfirmationEmail.sendconfirmationemail // DONE

exports.sendrefundemail = sendRefundEmail.sendrefundemail; // DONE

exports.getuserinformation = sendConfirmationEmail.getuserinformation; // DONE

exports.navigationeditrestaurantlink = navigationEditRestaurantLink.navigationeditrestaurantlink; //DONE

exports.redirectnorestaurant = navigationEditRestaurantLink.redirectnorestaurant; // DONE

exports.striperefund = stripeRefund.striperefund; // DONE

exports.determinetoshowrefund = stripeRefund.determinetoshowrefund; // DONE

exports.getrestaurantinformation = editRestaurantFormActions.getrestaurantinformation // DONE

exports.handlefileupload = editRestaurantFormActions.handlefileupload;// DONE

exports.validateformdata = editRestaurantFormActions.validateformdata; // DONE

exports.deleterestaurant = deleteRestaurant.deleterestaurant; // DONE

exports.gettransactiondate = deleteRestaurant.gettransactiondate; // DONE

exports.getrestaurantname = deleteRestaurant.getrestaurantname; // DONE

exports.getadmintransactiondata = adminTransactions.getadmintransactiondata; // DONE

exports.loadmoredata = adminTransactions.loadmoredata; // DONE

exports.addtestimonial = testimonials.addtestimonial; // DONE

exports.setuptestimonial = testimonials.setuptestimonial; // DONE

exports.loadtestimonials = testimonials.loadtestimonials; //  DONE

exports.sendpdfdownload = transactionsPDF.sendpdfdownload; // DONE

exports.changepasswordvalidation = passwordActions.changepasswordvalidation; // DONE

exports.useractionchangepassword = passwordActions.useractionchangepassword; // DONE

exports.respondwithuseremail = passwordActions.respondwithuseremail; // DONE

exports.sendforgotpasswordemail = forgotPassword.sendforgotpasswordemail; // DONE

exports.verifyandchangepassword = forgotPassword.verifyandchangepassword; // DONE

exports.checkresetpasswordtoken = forgotPassword.checkresetpasswordtoken; // DONE

exports.sendadminuserlist = adminUserListActions.sendadminuserlist; // DONE

exports.initialuserlist = adminUserListActions.initialuserlist; // DONE

exports.getmoreusers = adminUserListActions.getmoreusers; // DONE

exports.loadmoreformresults = adminUserListActions.loadmoreformresults; // DONE

exports.deletealluserdata = deleteAccount.deletealluserdata; // not yet implemented