const express = require("express");
const router = express.Router();

//below needed for authentication purpose
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load user model
const User = require('../../../models/User');

//public testing route
// @route /api/common/auth/test
router.get('/test', (req, res)=> res.json({msg:'common auth working'}))
//private testing route
router.get('/test/private',passport.authenticate("jwt", { session: false }),(req, res)=>{
    res.json(req.user)
})

// @route /api/common/auth/signUp

router.post('/signUp',(req, res)=>{
    if(req.body.isAdmin == true){
        //this is admin registration
        //first check if this email is registered in bank db as a admin or not
        //  if registered then
        User.findOne({ email:req.body.email, isAdmin:req.body.isAdmin })
        .then(user=>{
            if(user){
                return res.json({ msg: "Email already exist.." });
            }else{
                //create admin
                let newUser = new User({
                    name: req.body.name, //*
                    email: req.body.email, //*
                    password: req.body.password,//*
                    mobile: req.body.mobile?req.body.mobile:"",
                    signInType: req.body.signInType? req.body.signInType:"default",
                    joiningDate: req.body.joiningDate,
                    isAdmin: req.body.isAdmin,//*
                });

                //generate hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save()
                        .then(() => res.json({msg:'signUp successfull!'}))
                        .catch(err => res.json({msg:err}));
                    });
                  });
            }
        })

    }else{
        User.findOne({email:req.body.email, isAdmin:req.body.isAdmin})
            .then(user=>{
                if(user){
                    return res.json({ msg: "user already exist.." });
                }else{
                    //create agent
                    let newUser = new User({
                        name: req.body.name, //*
                        email: req.body.email, //*
                        password: req.body.password,//*
                        mobile: req.body.mobile?req.body.mobile:"",
                        signInType: req.body.signInType? req.body.signInType:"default",
                        joiningDate: req.body.joiningDate,
                        isAdmin: req.body.isAdmin,//*
                        currentCreditPoint: 0,
                        labels: 0
                    });

                    //generate hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                          newUser
                            .save()
                            .then(user => res.json({msg:'signUp successfull!'}))
                            .catch(err => res.json({msg:err}));
                        });
                      });
                }
            })
    }
})

// @route /api/common/auth/login
router.post('/login', async (req,res)=>{
    if(req.body.signInType=== 'google'){
        //social login
        // and create token
        let result = await User.findOne({ email: req.body.email});
        if(result != null){
            //already socially signed in
            const jwt_payload = { id: result._id,
                name: result.name,
                email: result.email,
                isAdmin: result.isAdmin }; // Create JWT jwt_payload
                //Create JWT Token
                jwt.sign(
                    jwt_payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                    }
                );
        }else{
            //create user and then create token
            let newUser;
            if(req.body.isAdmin == false){
                //normal agent
                let newUser = new User({
                    name:req.body.name? req.body.name:"",
                    email: req.body.email,
                    profileImage: req.body.profileImage? req.body.profileImage:"",
                    signInType:req.body.signInType,
                    isAdmin:req.body.isAdmin,
                    currentCreditPoint: 0,
                    labels: 0
                });
                newUser
                .save()
                .then(user => {
                    // console.log(user);
                    const jwt_payload = { id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin }; // Create JWT jwt_payload

                        //Create JWT Token
                        jwt.sign(
                            jwt_payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                            }
                        );
                })
                .catch(err => res.json(err));
            }else{
                //admin
                newUser = new User({
                    name:req.body.name? req.body.name:"",
                    email: req.body.email,
                    profileImage: req.body.profileImage? req.body.profileImage:"",
                    signInType:req.body.signInType,
                    isAdmin:req.body.isAdmin,
                });
                newUser
            .save()
            .then(user => {

                const jwt_payload = { id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin }; // Create JWT jwt_payload

                //Create JWT Token
                jwt.sign(
                    jwt_payload,
                    keys.secretOrKey,
                    { expiresIn: 36000 },
                    (err, token) => {
                    // console.log("jwt_payload" + jwt_payload);
                    res.json({
                        success: true,
                        token: "Bearer" + token
                    });
                    }
                );
            })
            .catch(err => res.json(err));
            }


        }
    }
    else{
        //email password login
        const email = req.body.email;
        const password = req.body.password;
        const signInType = req.body.signInType;

        User.findOne({ email, signInType }).then(user => {
          // Check user is available or not
          if (!user) {
            return res.json({ msg: "user not found" });
          }

          // Check password to compare
          bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              // Password match

              const jwt_payload = { id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profileImage: user.profileImage }; // Create JWT jwt_payload

              //Create JWT Token
              jwt.sign(
                jwt_payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            } else {
              return res.json({ msg: "Password incorrect" });
            }
          });
        })
        .catch(error=> res.json({msg:'server error!'}))
    }
})

router.post('/getUserData', async(req, res)=>{
    let user = await User.findOne({ email: req.body.email, isAdmin: req.body.isAdmin});
    if(user !== null){
        res.json(user);
    }else{
        res.json({msg:'problem in getting data'})
    }
})

//export file
module.exports = router;