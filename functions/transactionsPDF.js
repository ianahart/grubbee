
const fs = require('fs');
const os = require('os');
const path = require('path');
const util = require('util');

const admin = require('firebase-admin');
const puppeteer = require('puppeteer');
const functions = require('firebase-functions');
const cors = require('cors')( { origin: true });
const verifyUserToken = require('./verifyUserToken');


const writeFile = util.promisify(fs.writeFile);

const sendResponse = (httpMsg, statusCode, body) => {

    const fileType = statusCode === 200 ? 'application/pdf' : 'application/json';

        httpMsg.header('Content-Type', 'application/pdf;charset=utf-8');


  httpMsg
  .type(fileType)
  .status(statusCode)
  .send(
    {
    body,
    headers: {
      headers: {'Access-Control-Allow-Headers': 'Authorization'},

    },
    }
  );
};


const makeHTMLFile = async (html) => {

  const localHTMLFile = path.join(os.tmpdir(), 'transactions.html');

  await writeFile(localHTMLFile, html, 'utf8');


  return localHTMLFile;
};


const calculateSelectedPaymentsTotal = (payments) => {

 const total = payments
 .reduce(
   (acc, curr) => {

        if (curr.status !== 'refunded') {

          acc += parseInt(curr.amount);
        }
        return acc;
  }, 0);

  return total.toFixed(2);
}


const sortPaymentsDesc = (payments) => {

  return payments
  .sort(
    (a, b) => {

      if (a.createdAt > b.createdAt) {

        return -1;
      } else if (a.createdAt < b.createdAt) {

        return 1;
      } else {

        return 0;
      }
    }
  );
}

configureHTMLTemplate = async (data) => {

    const paymentTotal = calculateSelectedPaymentsTotal(data);

    const paymentsDesc = sortPaymentsDesc(data);

    const payments = paymentsDesc
    .map(
      (payment) => {

        let className = '';
       if (payment.status === 'completed') {

        className = 'completed-payment';
       } else if (payment.status === 'refunded') {

        className = 'refunded-payment';
       } else if (payment.status === 'cancelled') {

        className = 'cancelled-payment';
       }

      return `<tr class="${className}">
                <td>${payment.formattedDate }</td>
                <td>${payment.associatedUserId}</td>
                <td>${payment.cardbrand}</td>
                <td>${payment.status}</td>
                <td>${payment.amount}</td>
              </tr>`;
      }
    )
    .join('');




    const html = `


      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">

        <title>Document</title>

        <style>

        @media print and (color) {
   * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
   }
}
        @media print {


        .admin-payments-table-container {
            width: 100%;
            background-color: #fff;
            border: 1px solid #eee;
            margin-bottom: 3rem;
            height: 600px;
          }

          h3 {
            margin-left: 1rem;
          }
          .admin-payments-table {
            width: 90%;
            margin: 0 auto;
            border-collapse: collapse;
            margin-bottom: 2rem;
          }

            th {
              color: #d5d5d5;
              font-size: 0.8rem;
              padding: 0 0.5rem;
            }

            th, td {
              text-align: left;
            }


          .payments-total {
            text-align: right;
            margin: 0;
            padding: 0.3rem;
            margin-right: 0.3rem;
            font-weight: bold;
          }

          .payments-total span {
              font-weight: normal;
              font-size: 0.9rem;
              margin-right: 0.5rem;
            }


          .refunded-payment {
               background-color: rgba(0, 0, 0, 0.2);
          }

          .refunded-payment td:nth-of-type(4n+0) {
                color: darkslategrey;
                font-weight: bold;
          }

          .cancelled-payment {

            background-color: rgba(220, 0, 0, 0.2);
          }

          .cancelled-payment td:nth-of-type(4n+0) {
                  color: #ee6c4d;
                font-weight: bold;
          }

          .completed-payment {

            background-color: rgba(0, 220, 0, 0.2);
          }

          .completed-payment td:nth-of-type(4n+0) {
                  color: green;
                font-weight: bold;
          }


          .completed-payment,
          .refunded-payment,
          .cancelled-payment {

            border-bottom: #fbfbfb;
            height: 40px;
          }

      }
        </style
      </head>
      <body>
          <div class="admin-payments-table-container">
          <h3>Payments</h3>
          <table class="admin-payments-table">
            <tr>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Card Type</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
            ${payments}
          </table>
            <p class="payments-total"><span>Total Payments: $${paymentTotal}</span></p>
        </div>
      </body>
      </html>`;

// NEED TO CALCULATE PAYMENTS TOTAL
    const file = await makeHTMLFile(html);

    return file;
}


const configurePDF = async (file) => {

  try {


    const content = fs.readFileSync(file, 'utf8',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    const browser = await puppeteer.launch(
      {
        headless: true,
        args: ['--no-sandbox']
      }
    );

    const page = await browser.newPage();

    await page.setContent(content);

     const pdfBuffer = await page.pdf(
      {
         format: 'A4',
         preferCSSPageSize: true,
         printBackground: true
      }
    );

    await browser.close();

    return pdfBuffer.toString('base64');

  } catch (err) {

    console.log(`Error: ${err}`);

    console.log(`Error Message: ${err.message}`);
  }
};

const sendPDFDownload = async (req, res) => {

  try {

    const data = await configureHTMLTemplate(req.body.payments);

    const buffer = await configurePDF(data);

    sendResponse(res, 200,
      {
        data: buffer,
      }
    );

  } catch (err) {

    sendResponse(res, 500,
      {
      data: null,
      errors: err,
      message: 'failure'
      }
    );
  }
};



const runTimeOptions = {

  timeout: 300,
  memory: '1GB',
}

exports.sendpdfdownload = functions
.runWith(runTimeOptions)
.https
.onRequest(
  (request, response) => {

  return cors(request, response,
    async () => {

    const tokenVerified = await verifyUserToken(request, response);

    if (tokenVerified) {

      await sendPDFDownload(request, response);

    } else {

      response.status(403).send();
    }

     }
   );
  }
);



