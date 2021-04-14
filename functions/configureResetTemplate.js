const configureResetTemplate = (tokenURL, firstName, verificationCode) => {

    return `
      <div style="font-family: Arial, Helvetica, sans-serif;">
      <h3>Hello ${firstName}</h3>
        <p style="color: darkslategrey;">you are receiving this email because we received a password reset request for your account.</p>
        <p style="
        color: #2c9c91;
        font-weight: 900;
        margin-left: 30px;

        ">Verification Code:</p>
        <p style="
        color: white; font-size: 20px;
        background-color: darkslategray;
        text-align: center;
        padding: 12px;
        margin-left: 30px;
        width: 100px;
        ">${verificationCode}</p>
        <a style="text-decoration: none; color: #2c9c91;" href="${tokenURL}">Reset Password Link</a>

        <p style="color: darkslategrey; font-weight: 900; margin-bottom: 75px;">Follow the link above to get brought back to Grubbee and you will need to enter the verification code to complete the reset.</p>

        <p style="color: darkslategrey;">If you did not request a password reset, no further action is required.</p>

        <p style="color: darkslategrey; margin-bottom: 2px;">Regards,</p>
        <p style="color: darkslategrey; margin-top: 5px;">Grubbee</p>

      </div>
    `;

};






module.exports = configureResetTemplate;