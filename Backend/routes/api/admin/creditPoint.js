const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load user model
const CreditPoint = require("../../../models/CreditPoint");
const User = require("../../../models/User");
//public testing route
// @route /api/admin/creditPoint
router.get("/test", (req, res) =>
  res.json({ msg: "Admin creditPoint working" })
);
//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "private route working" });
  }
);

//@route  GET api/admin/creditPoint
//@dscn   Admin can view all agent creditPoint and label
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      User.find({ isAdmin: false }).then(result => {
        let agentResult = [];

        result.forEach(one => {
          let obj = {};
          obj.id = one._id;
          obj.agentName = one.name;
          obj.agentCreditPoint = one.currentCreditPoint;
          obj.agentLabel = one.labels;
          agentResult.push(obj);
        });
        res.json(agentResult);
      });
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);
//@route  GET api/admin/creditPoint/:search
//@dscn   Admin can view all agent creditPoint and label
//@access Private
router.get(
  "/:search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      User.find({
        isAdmin: false,
        name: new RegExp(req.params.search,"i")
       }).then(result => {
        let agentResult = [];

        result.forEach(one => {
          let obj = {};
          obj.id = one._id;
          obj.agentName = one.name;
          obj.agentCreditPoint = one.currentCreditPoint;
          obj.agentLabel = one.labels;
          agentResult.push(obj);
        });
        res.json(agentResult);
      });
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//@route  GET api/admin/creditPoint/getvalue/getcreditPointValue
//@dscn   Admin can view creditPoint with rupees
//@access Private
router.get(
  "/getvalue/getcreditPointValue",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      console.log("called")
      CreditPoint.find().then(result => {
        console.log(result);
        res.json(result);
      });
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/admin/creditPoint/add
//@dscn   Admin can add creditPoint as well as indian rupees
//@access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      let newCreditPoint = new CreditPoint({
        indianRupees: req.body.indianRupees
      });
      CreditPoint.find().then(result => {
        if (result.length > 0) {
          let update = {
            indianRupees: req.body.indianRupees
          };
          CreditPoint.findOneAndUpdate(
            { _id: result[0].id },
            { $set: update },
            { new: true }
          ).then(result => {
            res.json({msg:"Updated Successfully"});
          });
        } else {
          newCreditPoint
            .save()
            .then(result => res.json({msg:'Saved Succesfully'}))
            .catch(err => console.log(err));
        }
      });
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/admin/creditPoint/updatecreditPointValue
//@dscn   Admin can view creditPoint with rupees
//@access Private
router.post(
  "/updatecreditPointValue/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      let update = {
        indianRupees: req.body.indianRupees
      };
      CreditPoint.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { new: true }
      ).then(result => {
        res.json({msg:'Updated Successfully'});
      });
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//export file
module.exports = router;
