const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//mail
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

//load common model
const Payment = require("../../../models/Payment");
const User = require("../../../models/User");

// //public testing route
// // @route /api/common/payment
// router.get("/test", (req, res) => res.json({ msg: "common payment working" }));
// //private testing route
// router.get(
//   "/test/private",
//   passport.authenticate("jwt-1", { session: false }),
//   (req, res) => {
//     res.json({ msg: "private route working" });
//   }
// );

//@route  POST api/common/payment/saveAgentBankDetails
//@dscn   Agent can send bank details for encash his/her rewards point into bank a/c by admin help.
//@access Private
router.post(
  "/saveAgentBankDetails",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Check agent or not
    User.find({ email: req.user.email }).then(async agent => {
      if (agent) {
        // Save agent bank details
        const bankDetails = {
          userEmail: req.user.email,
          AccountHolderName: req.body.accountHolderName,
          BankName: req.body.bankName,
          AccountNo: req.body.accountNo,
          IfscCode: req.body.ifscCode,
          Micr: req.body.micr,
          amount: req.body.amount
        };
        const newBankDetails = new Payment(bankDetails);
        let payment = await newBankDetails
          .save();
            //update currentcredit point
            let obj = {};
            obj.withdrawAmount = req.body.amount;
            obj.withdrawDate = new Date();
            let userRecord = await User.findOne({ email: req.user.email});
            let newarr = userRecord.withdrawMoney;
            newarr.push(obj);
            let update = {
              currentCreditPoint: req.body.availableCreditPoint,
              withdrawMoney: newarr
            }
            await User.findOneAndUpdate(
              { email: req.user.email },
              { $set: update },
              { new: true }
            )
            //send response frontend
            res.json({ msg: `Bank details send successfully! Keep Payment Id ${payment._id} saved for future reference.` })
      } else {
        res.json({ msg: "Agent not match" });
      }
    });
  }
);

//@route  POST api/common/payment/underProcessing/:id
//@dscn   Admin can update agentBankStatus
//@access Private
router.post(
  "/underProcessing/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      // Update agentPaymentStatus
      const update = {
        status: "UNDER_PROCESSING"
      };
      Payment.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { new: true }
      ).then(() => res.json({ msg:"Payment Currently Under Processing"}));
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/common/payment/completePayment/:id
//@dscn   Admin can update agentBankStatus
//@access Private
router.post(
  "/completePayment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.isAdmin == true) {
      // Update agentPaymentStatus
      const update = {
        status: "COMPLETE_PAYMENT"
      };
      let payment = await Payment.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { new: true }
      );
        //send emailConfirmation then respond frontend
        await paymentEmailConfirmation(req.user.email,payment.userEmail, payment._id);
          res.json({msg:"Payment Completed"})

    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);



paymentEmailConfirmation = async(adminEmail,agentEmail, paymentId)=>{
    const adminmailId = adminEmail;
    //agent email
    const AgentEmail = agentEmail;
    const subject = "Syndicate Bank Notification";
    const messageToAgent = `Message: Payment is Succesfully Transfer and
    It will Processed by your bank within 6-7 Business Day, If Not get the amount Contact Bank with Payment Id "${paymentId}".
    Thank You.`;

    const msgToAgent = {
      to: AgentEmail,
      from: adminmailId,
      subject: subject,
      text: messageToAgent,
      html: "<strong>" + messageToAgent + "</strong>"
    };
    const f1 = () => {
      r = sgMail.send(msgToAgent);
    };

    Promise.all[f1()];
}

//@route  GET api/common/payment/getAllPaymentRequests
//@dscn   Admin can get all agent bank details
//@access Private
router.get(
  "/getAllPaymentRequests",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Check for admin
    if (req.user.isAdmin == true) {
      let payments = await Payment.find({
        $and:[{
          $or:[
            {status:'CREATED'},
            {status:'UNDER_PROCESSING'}
          ]
         }]

      })
        res.json(payments);
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//@route  GET api/common/payment/getAllPaymentRequests/:search
//@dscn   admin can get all payment details
//@access Private
router.get(
    "/getAllPaymentRequests/:search",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      // Check for admin
      if (req.user.isAdmin == true) {
        let payments = await Payment.find({
          $and:[{
            $or:[
              {status:'CREATED'},
              {status:'UNDER_PROCESSING'}
            ],
            userEmail: new RegExp(req.params.search,"i")
           }]
        })
        res.json(payments);
      } else {
        res.json({ msg: "Unauthorized for the action" });
      }
    }
  );

  //@route  GET api/common/payment/getAllPaymentwithstatus
//@dscn   Admin can get all agent bank details search bankHolderName or account number
//@access Private
router.get(
  "/getAllPaymentwithstatus",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
      let payments = await Payment.find({ userEmail: req.user.email})
        res.json(payments);
  }
);

 //@route  GET api/common/payment/getOnePayment/:id
//@dscn   Admin can get all agent bank details search bankHolderName or account number
//@access Private
router.get(
  "/getOnePayment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
      let payment = await Payment.findOne({ _id: req.params.id})
        res.json(payment);
  }
);


//@route  DELETE api/common/payment/delete/:id
//@dscn   Admin can delete all payment complete payment records
//@access Private
router.delete(
  "/deleteAllCompletedPayments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.isAdmin == true) {
      let completePayments = await Payment.find({ status: "COMPLETE_PAYMENT" });
      await completePayments.forEach(async each=>{
        await Payment.findOneAndDelete({ _id: each._id })
      });
      res.json({msg:'All Complete Payment records are deleted!'})
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//export file
module.exports = router;
