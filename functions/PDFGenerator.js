
const fs = require('fs');
const path = require('path');
const os = require('os');

const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const PDFUpload = async (PDFFile) => {

  try {

    const bucket = admin.storage().bucket();

    const existingFile = PDFFile.slice(5);

    const PDFExists = await bucket.file(existingFile).exists();

    if (PDFExists) {

      await bucket.file(existingFile).delete();
    }

    await bucket.upload(PDFFile, {

      metadata: {

        cacheControl: 'public, max-age=31536000',
    },
      }
    );

  } catch (err) {

    console.log('Error: ', err.message);
  }
}

const retrieveNoticeHTML = async () => {

  try {

      const bucket = admin.storage().bucket();

      const localNoticePDF = path.join(os.tmpdir(), 'localNoticePDF.pdf');

      const urlOptions = {
        version: "v4",
        action: "read",
        expires: Date.now() + 1000 * 60 * 2,
      }

    const signedUrl = await bucket
    .file('notice.html')
    .getSignedUrl(urlOptions);





    const browser = await puppeteer.launch(
      {
        headless: true,
        args: ['--no-sandbox']
      }
    );

    const page = await browser.newPage();

    await page.goto(signedUrl[0],  { waitUntil: 'networkidle2',

      }
    );

    await page.pdf(
      {
        path: localNoticePDF,
        format: 'Letter'
      }
    );
    await browser.close();

    await PDFUpload(localNoticePDF);

    fs.unlinkSync(localNoticePDF);
  } catch (err) {

    console.log('Error: ' + err.message);
  }

}


const PDFGenerator = async () => {

  try {

    await retrieveNoticeHTML();

  } catch (err) {

    console.log('Error: ' + err.message);

  }

}

module.exports = PDFGenerator;








