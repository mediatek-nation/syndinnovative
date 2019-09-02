const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

/*
                 Customer Management:
        ---------------------------------------------
      * Addition of custermer details.
      * To show pending customer records.
      * Complete customer records.
*/

//load user model
const Customer = require("../../../models/Customer");

//public testing route
// @route /api/user/customer
router.get("/test", (req, res) => res.json({ msg: "user Customer working" }));
//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "private route working" });
  }
);

//@route  POST api/user/customer/customerRegister
//@dscn   Register the customer route
//@access Private
router.post(
  "/customerRegister",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let existingCustomer = await Customer.find({
      'idProof.idProofNumber':req.body.idProofNumber,
      loanTitle:req.body.loanTitle
    })
    if(existingCustomer.length > 0){
      res.json({msg:'This customer with this loan detail is already exist!'});
    }
    else{
      let customer = {idProof:{} };
      // Create a new customer records
      // const customer = {
        customer.name= req.body.name;
        customer.address= req.body.address;
        customer.email= req.body.email;
        customer.mobile= req.body.mobile;
        customer.idProof.idProofType = req.body.idProofType;
        customer.idProof.idProofNumber = req.body.idProofNumber;
        customer.loanTitle= req.body.loanTitle;
        customer.loanAmount= req.body.loanAmount;
        customer.agentId= req.user._id;
        customer.agentEmailId= req.user.email;
        customer.applyDate= req.body.applyDate

      const newCustomer = new Customer(customer);
      newCustomer
        .save()
        .then(data =>{
          res.json({ msg: "Customer records successfully register." })
        });
    }
  }
);

//@route  GET api/user/customer/getPendingCustomers
//@dscn   Agent can show pending customer records
//@access Private
router.get(
  "/getPendingCustomers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all pending customer records
    Customer.find({
      agentEmailId: req.user.email,
      $and: [
        {
          $or: [
            { currentStatus: "CREATED" },
            { currentStatus: "PENDING_FOR_CIBIL_SCORE" },
            { currentStatus: "CIBIL_SCORE_COMPLETE" }
          ]
        }
      ]
    }).then(result => res.json(result));
  }
);

//@route  GET api/user/customer/getPendingCustomers/:searchText
//@dscn   Agent can show pending customer records
//@access Private
router.get(
  "/getPendingCustomers/:searchText",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all pending customer records
    Customer.find({
      agentEmailId: req.user.email,
      $and: [
        {
          $or: [
            { currentStatus: "CREATED" },
            { currentStatus: "PENDING_FOR_CIBIL_SCORE" },
            { currentStatus: "CIBIL_SCORE_COMPLETE" }
          ],
          $or: [
            { name: new RegExp(req.params.searchText, "i") },
            {
              "idProof.idProofNumber": new RegExp(req.params.searchText, "i")
            }
          ]
        }
      ]
    }).then(customers => {
      if (customers) {
        res.json(customers);
      } else {
        res.json("No customers found");
      }
    });
  }
);


//@route  GET api/user/customer/getCompletedCustomers
//@dscn   Agent can show Completed customer records
//@access Private
router.get(
  "/getCompletedCustomers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all completed customer records
    Customer.find({
      agentEmailId: req.user.email,
      $and: [
        {
          $or: [
            { currentStatus: "LOAN_APPROVED" },
            { currentStatus: "FINISH" },
          ]
        }
      ]
    }).then(result => res.json(result));
  }
);

//@route  GET api/user/customer/getCompletedCustomers/:searchText
//@dscn   Agent can show Completed customer records
//@access Private
router.get(
  "/getCompletedCustomers/:searchText",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all Completed customer records
    Customer.find({
      agentEmailId: req.user.email,
      $and: [
        {
          $or: [
            { currentStatus: "LOAN_APPROVED" },
            { currentStatus: "FINISH" },
          ],
          $or: [
            { name: new RegExp(req.params.searchText, "i") },
            {
              "idProof.idProofNumber": new RegExp(req.params.searchText, "i")
            }
          ]
        }
      ]
    }).then(customers => {
      if (customers) {
        res.json(customers);
      } else {
        res.json("No customers found");
      }
    });
  }
);

//export file
module.exports = router;
