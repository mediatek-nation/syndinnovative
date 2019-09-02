const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);


/*
 * View all created customer
 * Update customer status after checking cibil score via API
 * Updating customer status after loan approval as well as update the agent credit point
 * Search via customer name and agentEmailid
 *
 * pending customer list getAll
 * pending customer list getBy agentemail or  customername
 */

//load user model
const Customer = require("../../../models/Customer");
const Product = require("../../../models/Product");
const Bonus = require("../../../models/Bonus");

// @route /api/admin/customer

//public testing route
router.get("/test", (req, res) => res.json({ msg: "Admin customer working" }));
//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt-1", { session: false }),
  (req, res) => {
    res.json({ msg: "private route working" });
  }
);

//@route  POST api/admin/customer/pendingForCibilScore/:id
//@dscn   Admin can update customer status
//@access Private
router.post(
  "/pendingForCibilScore/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      // Update customer status
      const update = {
        currentStatus: "PENDING_FOR_CIBIL_SCORE"
      };
      Customer.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { new: true }
      ).then(() => res.json({msg:"Under Cibil score Processing"}))
      .catch(err=>{msg:err});
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/admin/customer/completeCibileScore/:id
//@dscn   Admin can update customer status
//@access Private
router.post(
  "/completeCibileScore/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      // Update customer status
      const update = {
        currentStatus: "CIBIL_SCORE_COMPLETE"
      };
      Customer.findOneAndUpdate(
        { _id: req.params.id },
        { $set: update },
        { new: true }
      ).then(() => res.json({msg:" Cibil Score Done"}));
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/admin/customer/loanApprovedComplete/:id
//@dscn   Admin can update customer status
//@access Private
router.post(
  "/loanApprovedComplete/:id",
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {

    // working flow in this route
    // 1. update customer currentStatus and notificationStatus
    // 2.get loantitle from customer and go to product and get creditpoint for that particular product
    // 3. update agent creditpoint and check
    // untill level are not equal and creeditpoint <= updatedcredit point  add to updated credit point

    if (req.user.isAdmin == true) {
      // Update customer status start

      let customer = await Customer.findOne({ _id: req.params.id });
      if(customer != null){
        const agent = await User.findOne({ email: customer.agentEmailId });
        if(agent != null){
          let product = await Product.findOne({productTitle: customer.loanTitle});
          if(product != null){
            let bonus = await Bonus.find({  $and:[  {"agentLabel":{"$gt": agent.labels}}  ] });
            let cpoint=product.productCreditPoint+agent.currentCreditPoint,level = agent.labels;

            bonus.forEach(each=>{
              if(cpoint >= each.creditPoint){
                cpoint += each.bonusCreditPoint;
                level = each.agentLabel;
              }
            })

            //update customer status
            const update = {
              currentStatus: "LOAN_APPROVED",
              notificationStatus: true
            };
            await Customer.findOneAndUpdate(  { _id: req.params.id },{ $set: update },{ new: true } );

            //update agent
            await User.findOneAndUpdate(  { _id: agent.id },{ $set: {
                        currentCreditPoint: cpoint, labels: level } },  { new: true } );

            await sendEmailConfirmation(req.user.email,customer.agentEmailId, customer.email);
            res.json({msg:"Loan is succesfully approved and agent Will get Rewards shortly"});
          }else{
            res.json({msg:'Product Not Found'});
          }
        }else{
          res.json({msg:'Agent Not Found'});
        }
      }else{
        res.json({ msg: "Customer Not Found" });
      }
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

  sendEmailConfirmation = async(adminEmail,agentEmail, customerEmail)=>{
    const adminmailId = adminEmail;
    //agent email
    const AgentEmail = agentEmail;
    const subject = "Syndicate Bank Notification";
    const messageToAgent = `Message: Loan of Customer whose mail id is ${customerEmail} is Approved and
    You Wil get Your Reward Point Shortly Into Your account!
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

// customer email
    const CustomerEmail = customerEmail;
    const messageToCustomer = `Message: Your loan is approved. Contact bank For Further Procedure.
      Thank You.
    `;

    const msgToCustomer = {
      to: CustomerEmail,
      from: adminmailId,
      subject: subject,
      text: messageToCustomer,
      html: "<strong>" + messageToCustomer + "</strong>"
    };


    const f2 = () =>{
      s = sgMail.send(msgToCustomer);
    }
    Promise.all[f1(), f2()];
    // res.json({
    //   message: "Thanks for contact us. We will get back to you shortly."
    // });
  }

//@route GET api/admin/customer/getPendingCustomers
//@dscn   Admin can show pending customer records
//@access Private
router.get(
  "/getPendingCustomers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all pending customer records
    Customer.find({
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

//@route  POST api/admin/customer/getPendingCustomers/:searchText
//@dscn   Admin can show pending customer records
//@access Private
router.get(
  "/getPendingCustomers/:searchText",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Show all pending customer records
    if (req.user.isAdmin == true) {

        Customer.find({
          $and: [
            {
              $or: [
                { currentStatus: "CREATED" },
                { currentStatus: "PENDING_FOR_CIBIL_SCORE" },
                { currentStatus: "CIBIL_SCORE_COMPLETE" }
              ]
            },
            {
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
      } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//export file
module.exports = router;

