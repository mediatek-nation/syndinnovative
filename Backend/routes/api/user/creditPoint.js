const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

/*
          Agent
      -----------
    * Agent can view of credit point as well as equal indian current
    * View lebel or position
    * View encash histroy
*/

//load user model
const CreditPoint = require('../../../models/CreditPoint');
const User = require("../../../models/User");

// @route /api/user/creditPoint

//public testing route
// router.get("/test", (req, res) =>
//   res.json({ msg: "user creditPoint working" })
// );

// //private testing route
// router.get(
//   "/test/private",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({ msg: "private route working" });
//   }
// );

//@route  GET api/user/creditPoint/getCreditPointAndRupees
//@dscn   getting credit point and equvalent ruppes the creditPoint route
//@access private

router.get(
  "/getCreditPointAndRupees",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let ans = {};
    let agentResult = await User.findOne({ _id: req.user._id });
    ans.label = agentResult.labels;
    ans.joiningDate = agentResult.joiningDate;
    ans.currentCreditPoint = agentResult.currentCreditPoint;
    let equvalentRupees = await CreditPoint.find();
    ans.rupees = +equvalentRupees[0].indianRupees * ans.currentCreditPoint;
    res.json(ans);
  }
);

//@route  GET api/user/creditPoint/getPaymentHistory/getAll
//@dscn   getting payment history by the app route
//@access private

router.get(
  "/getPaymentHistory/getAll",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let ans = await User.findOne({email: req.user.email});
    res.json(ans.withdrawMoney);
  }
);

//export file
module.exports = router;
