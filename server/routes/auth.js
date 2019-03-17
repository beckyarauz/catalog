const express = require("express")
const passport = require('passport')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Bcrypt to encrypt passwords
// const bcrypt = require("bcrypt")
// const bcryptSalt = 10

router.post("/signup", (req, res, next) => {
  console.log(req.body)
  const { username, password} = req.body
  if (!username || !password) {
    res.status(400).json({ message: "Indicate username and password" })
    return
  }
  User.findOne({ username })
    .then(userDoc => {
      console.log('file:auth.js',userDoc);
      if (userDoc !== null) {
        res.status(409).json({ message: "The username already exists" })
        return
      } else {
        console.log('creating new user')
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)
        const newUser = new User({ username, password: hashPass})
        res.status(201).json({message:"succesfully signed Up!"})
        return newUser.save()
      }
      
    })
    .then(userSaved => {
      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userSaved, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userSaved.password = undefined;
        res.json( userSaved );
      });
    })
    .catch(err => next(err))
})
// )
router.post("/login",passport.authenticate('local',{ 
  successRedirect: '/login-success',
  failureRedirect: '/login-fail',
  failureFlash: true 
}))

router.get('/login-success',(req,res)=>{
  console.log('file: auth.js message:login success');
  res.status(200).json({message:'You are logged in'})
})
router.get('/login-fail',(req,res)=>{
  console.log('file: auth.js message: login failed');
  res.status(400).json({message:'You cant Log out'})
  
})
router.get('/logout-success',(req,res)=>{
  console.log('file: auth.js message: user logged out');
  res.status(200).json({message:'You logged out succesfully'})
})

router.get('/logout', (req, res, next) => {
  console.log('file: auth.js message:current session about to log out',req.session);
  req.session.destroy((err) => {
    res.redirect('/logout-success');
  });
});
router.get("/isLogged", (req, res) => {
  console.log('file: auth.js message: verification if user is logged in',req.user);
  if(req.user !== undefined && req.user !== null){
    // res.status(200).json({ message: 'You are logged in' })
    res.json({message:'hey',isLogged:true})
    return true;
  } else {
    // res.status(400).json({ message: 'You are not  logged in' })
    console.log('user not logged in')
    res.json({message:'not logged in',isLogged:false})
    return false;
  }
  
})

module.exports = router
