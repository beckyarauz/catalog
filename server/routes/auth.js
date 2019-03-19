const express = require("express")
const passport = require('passport')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Bcrypt to encrypt passwords
// const bcrypt = require("bcrypt")
// const bcryptSalt = 10

router.post("/signup", async (req, res, next) => {
  try{

    const { username, password} = req.body
    if (!username || !password) {
      res.status(400).json({ message: "Indicate username and password" })
      return
    }

    let userDoc = await User.findOne({ username });

    if (userDoc !== null) {
      res.status(409).json({ message: "The username already exists" })
      return
    } else {
      console.log('creating new user')

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      const newUser = await User({ username, password: hashPass})

      let savedUser = await newUser.save();

      console.log(savedUser);
      
      passport.authenticate('local')(req,res,function(){

        res.status(200).json({message:"succesfully signed Up!", user: req.user})
      })
    }
      


  } catch(e){
    console.log(e);
    next(e)
  }
})
// )
router.post("/login",passport.authenticate('local',{ 
  successRedirect: '/login-success',
  failureRedirect: '/login-fail',
  failureFlash: true 
}))

router.get('/login-success',(req,res)=>{
  // console.log('file: auth.js message:login success');
  res.status(200).json({message:'You are logged in'})
})
router.get('/login-fail',(req,res)=>{
  // console.log('file: auth.js message: login failed');
  res.status(400).json({message:'You cant Log out'})
  
})
router.get('/logout-success',(req,res)=>{
  // console.log('file: auth.js message: user logged out');
  res.status(200).json({message:'You logged out succesfully'})
})

router.get('/logout', (req, res, next) => {
  // console.log('file: auth.js message:current session about to log out',req.session);
  req.session.destroy((err) => {
    res.redirect('/logout-success');
  });
});
router.get("/isLogged", (req, res) => {
  // console.log('file: auth.js message: verification if user is logged in',req.user);
  if(req.user !== undefined && req.user !== null){
    if(req.user.role === 'SELLER'){
      res.status(200).json({message:'You are logged in',isLogged:true, isSeller:true})
    } else {
      res.status(200).json({message:'You are logged in',isLogged:true, isSeller:false})
    }
    
  } else {
    console.log('file:auth.js GET/isLogged user not logged in')
    res.status(200).json({message:'not logged in',isLogged:false})
  }
  
})

module.exports = router
