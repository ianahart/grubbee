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


const verifyIsAdmin = async (currentUserId) => {

  let isAdmin;

  try {

    const db = admin.firestore();

    const documents = await db
    .collection('users')
    .where('userId', '==', currentUserId)
    .get();

     for (const document of documents.docs) {

        if (documents._size === 1) {

          if (document.data().isAdmin) {

            isAdmin = true;
          } else {

            isAdmin = false;

            throw new Error('User is not an admin');
          }
        }
     }

     return isAdmin;

  } catch (err) {


    return err.message;

  }
};

const formatCreatedAt = (timestamp) => {

    const date = new Date(1970, 0, 1);

    date.setSeconds(timestamp);

    let month = date.getMonth() + 1;

    let day = date.getDate();

    let year = date.getFullYear();

    if (month > 12) {

      month = '01';
    } else if (month < 10) {

      month = `0${month}`;
    }

    if (day < 10) {

      day = `0${day}`;
    }

    return `${month}/${day}/${year}`;
};



const retrieveAdminTransactions = async (tableName, field, sort, limit) => {

  let transactions = [];

  try {

    const now = new Date();

    const nowInSeconds = Math.round(now.getTime() / 1000);

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .orderBy(field, sort)
    .limit(limit)
    .startAt(nowInSeconds)
    .get();

    for (const document of documents.docs) {

        const transaction = document.data();

        transaction.formattedDate = formatCreatedAt(transaction.createdAt);

        if (transaction.status === 'refunded') {

          transaction.amount = `-${transaction.amount}`;
        }

        transactions.push(transaction);
    }

    return transactions;

  } catch (err) {

    console.log(err);

    console.log(err.message);
  }
};

const getTransactionsSize = async (tableName) => {

  let size;

  try {

    const db = admin.firestore();

    const documents = await db.collection(tableName).get();

    size = documents._size;

    return size;

  } catch (err) {

    console.log(err.message);
  }

};

const formatAmount = (amount) => {

  return parseInt(amount);
}

const getTotals = async (tableName, dataSet) => {

  let total = 0;

  let transactions = [];

  try {

    const db = admin.firestore();

    const documents = await db.collection(tableName).get();

    if (documents._size === 0) {

      return total;
    }

    for (const document of documents.docs) {

      transactions.push(document.data());
    }

    if (dataSet === 'charges') {

      total = transactions
        .reduce(
          (acc, prev) => {

            return acc += formatAmount(prev.amount);

          }, 0
        );
    }
    if (dataSet === 'payments') {


      total = transactions
      .reduce(
        (acc, prev) => {

          if (prev.status !== 'refunded') {

             acc += formatAmount(prev.amount);
          }
          return acc;
        }, 0
      );
    }

    return total.toFixed(2);

  } catch (err) {

  }
};

const getAdminTransactionData = async (req, res) => {

  let transactions;

  let transactionsSize;

  let chargesTotal;

  let paymentsTotal;

  try {

      const adminIsVerified = await verifyIsAdmin(req.body.currentUserId);
      console.log(adminIsVerified);

      if (typeof adminIsVerified !== 'boolean') {

        throw new Error('User is not authorized');

      } else {

        if (adminIsVerified) {

            transactions = await retrieveAdminTransactions('transactions', 'createdAt', 'desc', 10);

            transactionsSize = await getTransactionsSize('transactions');

            chargesTotal = await getTotals('transactions', 'charges');

            paymentsTotal = await getTotals('transactions', 'payments');

            sendResponse(res, 200,
                {
                status: 200,
                error: null,
                charges: transactions,
                payments: transactions,
                size: transactionsSize,
                chargesTotal: chargesTotal,
                paymentsTotal: paymentsTotal,
                }
            );
        }
      }

  } catch (err) {

    sendResponse(res, 200,
      {
       status: 401,
       error: err.message,
       charges: null,
       payments: null,
       size: 0,
       chargesTotal: null,
      }
    );
  }
};

const fetchBatchOfTransactions = async (lastItem, tableName,sort, limit, field) => {

  try {

    const nextBatch = [];

    const db = admin.firestore();

    const documents = await db
    .collection(tableName)
    .orderBy(field, sort)
    .startAfter(lastItem.createdAt)
    .limit(limit)
    .get();

    for (document of documents.docs) {

      const transaction = document.data();

      transaction.formattedDate = formatCreatedAt(transaction.createdAt);

      if (transaction.status === 'refunded') {

        transaction.amount = `-${transaction.amount}`;
      }

      nextBatch.push(transaction);
    }

    return nextBatch;

  } catch (err) {

    console.log(err);

    console.log(err.message);
  }
};


const loadMoreData = async (req, res) => {

  try {

    const batchOfCharges = await fetchBatchOfTransactions(req.body.lastItemOnPage, 'transactions',  'desc', 5, 'createdAt');

    if (batchOfCharges.length) {

      sendResponse(res, 200,
        {

        statusCode: 200,
        data: batchOfCharges,
        resource: req.body.resource,
        error: null,
        }
      );
    } else {

     sendResponse(res, 200,
      {

      statusCode: 400,
      data: null,
      resource: null,
      error: 'No more transactions to display',
      }
    );
    }

  } catch (err) {

    sendResponse(res, 500,
      {

      statusCode: 500,
      data: null,
      resource: null,
      error: 'Internal Server Error',
      }
    );
  }
};

exports.getadmintransactiondata = functions
.https
.onRequest(
  (request, response) => {

  return cors(request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

      if (tokenVerified) {

        await getAdminTransactionData(request, response);

      } else {

        response.status(403).send();
      }
    }
  );
  }
);

exports.loadmoredata = functions
.https.
onRequest(
  (request, response) => {
    return cors(request, response,
      async () => {

        const tokenVerified = await verifyUserToken(request, response);

        if (tokenVerified) {

            await loadMoreData(request, response);
        } else {

          response.status(403).send();
        }
      }
    );
  }
);