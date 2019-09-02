const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load user model
const Bonus = require('../../../models/Bonus');

/*
 * Insert
 * Match id to id and update
 * Match id to id and delete
 * Get findOne match id to id
 ** Searching by any three of the field
 */

//public testing route
// @route /api/admin/Bonus
router.get('/test', (req, res)=> res.json({msg:'Admin Bonus working'}))
//private testing route
router.get('/test/private',passport.authenticate("jwt", { session: false }),(req, res)=>{
    res.json({msg:'private route working'})
})


//@route  POST api/admin/bonus/addBonus
//@dscn   Admin can add bonus
//@access Private
router.post("/addBonus", passport.authenticate("jwt", { session: false }),(req, res) => {
    if(req.user.isAdmin == true){
        // Create a new bonus
        const bonus = {
        creditPoint: req.body.creditPoint,
        bonusCreditPoint: req.body.bonusCreditPoint,
        agentLabel: req.body.agentLabel
        };
        Bonus.find({ creditPoint: req.body.creditPoint})
        .then(result=>{
          if(result.length > 0){
            res.json({msg:'already created'})
          }else{
            const newBonus = new Bonus(bonus);
            newBonus
            .save()
            .then(bonus => res.json({ msg: "Bonus Created Successfully" }));
          }
        })

    }else{
        res.json({message:'Unauthorized for the action'})
    }
})

//@route  POST api/admin/bonus/addBonus/:id
  //@dscn   Admin can update addBonus
  //@access Private
  router.post("/addBonus/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.isAdmin == true){
         // Update product
    const bonus = {
        creditPoint: req.body.creditPoint,
        bonusCreditPoint: req.body.bonusCreditPoint,
        agentLabel: req.body.agentLabel
      };

      Bonus.findOneAndUpdate(
        { _id: req.params.id },
        { $set: bonus },
        { new: true }
      ).then(bonusResult => res.json({msg:'Bonus Updated Successfully'}));
    }else{
        res.json({message:'Unauthorized for the action'})
    }
  });

  //@route  DELETE api/admin/bonus/deleteBonus/:id
  //@dscn   Admin can delete bonus
  //@access Private
  router.delete("/deleteBonus/:id",passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.isAdmin == true){
       // Delete bonus modules
    Bonus.deleteOne({ _id: req.params.id }).then(DeleteBonus =>
        res.json({ msg: "Bonus Deleted Successfully" })
      );
   }else{
       res.json({message:'Unauthorized for the action'})
   }

  });

  //@route  GET api/admin/bonus/getAll/:searchText
  //@dscn   Admin can search bonus by any three field
  //@access Private
  router.get("/getAll/:searchText", passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.isAdmin == true){
        let searchText = req.params.searchText;
    Bonus.find({
      $or: [
        { creditPoint: new RegExp(searchText+"", "i") },
        { bonusCreditPoint: new RegExp(searchText+"", "i") },
        { agentLabel: new RegExp(searchText+"", "i") }
      ]
    }).then(bonusResult => res.json(bonusResult));
    }else{
        res.json({message:'Unauthorized for the action'})
    }

  });

  //@route  GET api/admin/bonus/getOne/:id
  //@dscn   Admin can search bonus details by id
  //@access Private
  router.get("/getOne/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.isAdmin == true){
        Bonus.findOne({ _id: req.params.id }).then(bonusResult =>
            res.json(bonusResult)
          );
    }else{
        res.json({message:'Unauthorized for the action'})
    }

  });

  //@route  GET api/admin/bonus/getAll
  //@dscn   Admin can search all bonus
  //@access Private
  router.get("/getAll", passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.isAdmin == true){
        Bonus.find().then(bonusResult => res.json(bonusResult));
    }else{
        res.json({message:'Unauthorized for the action'})
    }

  });

//export file
module.exports = router;