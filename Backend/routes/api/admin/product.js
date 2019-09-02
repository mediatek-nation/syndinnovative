const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

/*
 * Product insert
 * Matching id to id and update
 * Matching id to id and delete
 */

//load user model
const Product = require("../../../models/Product");

//public testing route
// @route /api/admin/product
router.get("/test", (req, res) => res.json({ msg: "Admin product working" }));
//private testing route
router.get(
  "/test/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "private route working" });
  }
);

//@route  POST api/admin/product/regProduct
//@dscn   Admin can register product
//@access Private
router.post(
  "/regProduct",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.isAdmin == true) {
      // Create a new product
      let result = await Product.findOne({productTitle: req.body.productTitle});
      if(result){
        return res.json({msg:'Product Already exist, change the title'});
      }
      const product = {
        productTitle: req.body.productTitle,
        productDescription: req.body.productDescription,
        productCreditPoint: req.body.productCreditPoint
      };
      const newProduct = new Product(product);
      newProduct
        .save()
        .then(() =>
          res.json({ msg: "Product Created successfully" })
        )
        .catch(err=> res.json({ msg:err}))
    } else {
      res.json({ msg: "Unauthorized for the action" });
    }
  }
);

//@route  POST api/admin/product/regProduct/:id
//@dscn   Admin can update register product
//@access Private
router.post(
  "/regProduct/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      // Update product
      const product = {
        productTitle: req.body.productTitle,
        productDescription: req.body.productDescription,
        productCreditPoint: req.body.productCreditPoint
      };

      Product.findOneAndUpdate(
        { _id: req.params.id },
        { $set: product },
        { new: true }
      ).then(() => res.json({msg:'Product Updated Successfully'}));
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//@route  GET api/admin/product/delete/:id
//@dscn   Admin can delete product
//@access Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.isAdmin == true) {
      // Delete product modules
      Product.findOneAndDelete({ _id: req.params.id }).then(() =>
        res.json({ msg: "Product Deleted successfully" })
      );
    } else {
      res.json({ message: "Unauthorized for the action" });
    }
  }
);

//export file
module.exports = router;
