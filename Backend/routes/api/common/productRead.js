const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load user model
// const Product = require('../../../models/Product');

//public testing route
// @route /api/user/productRead
router.get('/test', (req, res)=> res.json({msg:'Common productRead working'}))
//private testing route
router.get('/test/private',passport.authenticate("jwt-1", { session: false }),(req, res)=>{
    res.json({msg:'private route working'})
})

//   //@route  GET api/common/productRead/getAll
//   //@dscn   Admin or agent can get product list
//   //@access Private
  router.get('/getAll', passport.authenticate("jwt", { session: false }), (req, res) => {
    Product.find().then(products => res.json(products));
  });


//   //@route  GET api/auth/productRead/getAll/:productTitle
//   //@dscn   Admin or agent can search by productTitle
//   //@access Private
  router.get('/getAll/:productTitle', passport.authenticate("jwt", { session: false }), (req, res) => {
    Product.find({ productTitle: new RegExp(req.params.productTitle, "i") }).then(products => res.json(products));
  });

    //@route  GET api/auth/productRead/getOne/:id
  //@dscn   Admin or agent can single product by product id
  //@access Private
router.get('/getOne/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    Product.findOne({ _id: req.params.id }).then(product => res.json(product));
  });

//export file
module.exports = router;