const express = require("express");
const router = express.Router();

// For authentication purpose
const passport = require("passport");

// Load customer modules
const Customer = require("../../../models/Customer");

// @route /api/common/notification
//public testing route
router.get("/test", (req, res) =>
  res.json({ msg: "Common notification working" })
);

//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt-1", { session: false }),
  (req, res) => {
    res.json({ msg: "private notification working" });
  }
);

//@route  GET api/common/notification/getNotification
//@dscn   Admin or agent can view notification
//@access Private
router.get(
  "/getNotification",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.isAdmin == true) {
      // //it is admin
      // let customerNotifications = await Customer.find({
      //   currentStatus:'LOAN_APPROVED',
      //   notificationStatus: true
      // });
      // res.json(customerNotifications);
    }else{
      //it is agent
      let customerNotifications = await Customer.find({
        currentStatus:'LOAN_APPROVED',
        agentEmailId: req.user.email,
        notificationStatus: true
      });
      res.json(customerNotifications);
    }
  }
);

//@route  POST api/common/notification/updateNotificationStatus
//@dscn   Admin or agent can update notification
//@access Private
router.post(
  "/updateNotificationStatus/:id",passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.isAdmin == true) {
      // //it is admin
      // let customerNotifications = await Customer.find({
      //   currentStatus:'LOAN_APPROVED',
      //   notificationStatus: true
      // });
      // res.json(customerNotifications);
    }else{
      //it is agent
      await Customer.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { notificationStatus: false } },
        { new: true }
      );
      res.json("notification seen done");
    }
  }
);


module.exports = router;
