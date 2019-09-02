const express = require("express");
const router = express.Router();

const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_KEY);

// @type    POST
//@route    /api/contact/
// @desc    route for sending email from user to admin
// @access  PUBLIC

router.post("/", (req, res) => {
  const adminmailId = "biraj.halder1992@gmail.com";
  const UserEmail = "birajhalder123@gmail.com";

  const subject = "Syndicate Bank Notification";
  const message = `Message: ${"Your loan is approved."}`;

  const msg = {
    to: UserEmail,
    from: adminmailId,
    subject: subject,
    text: message,
    html: "<strong>" + message + "</strong>"
  };

  const f1 = () => {
    r = sgMail.send(msg);
  };
  Promise.all[f1()];
  res.json({
    message: "Thanks for contact us. We will get back to you shortly."
  });
});

module.exports = router;
