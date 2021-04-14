const formatDateAdded = require('./formatDate.js');

const configureRefundTemplate = (data) => {

       const date = formatDateAdded(data.refund.created);
  return `
    <div style="width: 100%; height: 100%;">
      <div style="margin: 24px;">
        <p style="color: gray;"><i>${date}</i></p>
        <h3>Hi ${data.user.firstName},</h3>
        <div>
        <p style="text-align: center; line-height: 1.6;">We are sorry that Grubbee did not meet your expectations. You have been refunded the total amount of the restaurant signup fee.
           We appreciate being able to serve you and hope that you will reconsider Grubbee in the near future.
        </p>
       </div>
       <div style="text-align: center; margin-top: 60px;">
         <table width=500 align="center" style="font-family: arial, sans-serif; border-collapse: collapse;">

           <tr style="background-color: #ddd;">
             <th style="border: 1px solid #ddd; text-align: left; padding: 8px;">Refund Information</th>
             <th style="border: 1px solid #ddd; text-align: left; padding: 8px;">Your details</th>
           </tr>
           <tr>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Refunded</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${date}</td>
           </tr>
            <tr style="background-color: #ddd;">
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Card Brand</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${data.transaction.cardbrand}</td>
           </tr>
            <tr>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Last Four Digits</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${data.transaction.lastfourdigits}</td>
           </tr>
            <tr style="background-color: #ddd;">
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Name on Card</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${data.transaction.name}</td>
           </tr>
             <tr>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Currency</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${data.transaction.currency.toUpperCase()}</td>
           </tr>
            <tr>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Zip Code</td>
             <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">${data.transaction.zipcode}</td>
           </tr>
         </table>
       </div>
       <h3 style="margin-top: 60px; text-align: center;">Have Any Further Questions?</h3>
        <div style="display: flex; text-align:center; margin-top: 60px;">
         <div style="width: 200px;">
             <p style="
              font-weight: bold;
              color:  #3D5A80;">Phone to Reach Us:</p>
             <p
             style="
              font-weight: bold;
              color:  #3D5A80;"
              >362-765-0971</p>
           </div>
                <span
          style="
            display: inline-block;
            width: 40%;">
              &nbsp;
         </span>
           <div style="float: right; width: 200px">
             <p style="
             margin: 0.3rem;
            color: #45aebf;">grubbeefood@zohomail.com</p>
             <p style="
              margin: 0.3rem;
              color: #45aebf"

             >717 Westbrook Way, Anahiem, CA, 09567</p>
           </div>
        </div>
     </div>
    </div>
  `;
};


module.exports = configureRefundTemplate;