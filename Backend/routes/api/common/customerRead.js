const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load user model
const Customer = require("../../../models/Customer");

//public testing route
// @route /api/common/customerRead
router.get("/test", (req, res) =>
  res.json({ msg: "Common customerRead working" })
);
//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "private route working" });
  }
);

//@route  GET api/common/customerRead/getAll
//@dscn   Admin or agent can view customer details
//@access Private
router.get(
  "/getAll",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      Customer.find().then(customerResult => res.json(customerResult));
    } else {
      Customer.find({ agentEmailId: req.user.email }).then(customerResult =>
        res.json(customerResult)
      );
    }
  }
);

//@route  GET api/common/customerRead/getAll/:searchText
//@dscn   Admin and agent can search customer name OR email id
//@access Private
router.get(
  "/getAll/:searchText",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      Customer.find({
        $and: [
          {
            $or: [
              { name: new RegExp(req.params.searchText, "i") },
              {
                "idProof.idProofNumber": new RegExp(req.params.searchText, "i")
              }
            ]
          }
        ]
      }).then(customerResult => res.json(customerResult));
    } else {
      Customer.find({
        
        $and: [
          {agentEmailId: req.user.email},
          {
            $or: [
              { name: new RegExp(req.params.searchText, "i") },
              {
                "idProof.idProofNumber": new RegExp(req.params.searchText, "i")
              }
            ]
          }
        ]
      }).then(customerResult => res.json(customerResult));
    }
  }
);

//@route  GET api/common/customerRead/getOne/:id
//@dscn   Admin or agent can get single customer by customer id
//@access Private
router.get(
  "/getOne/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Customer.findOne({ _id: req.params.id }).then(customer =>
      res.json(customer)
    );
  }
);

//export file
module.exports = router;

