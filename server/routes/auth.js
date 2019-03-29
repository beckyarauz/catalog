const express = require("express")
const passport = require('passport')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.post("/signup", async (req, res, next) => {
  try {

    const {
      username,
      password
    } = req.body
    if (!username || !password) {
      res.status(400).json({
        message: "Indicate username and password"
      })
      return
    }

    let userDoc = await User.findOne({
      username
    });

    if (userDoc !== null) {
      res.status(409).json({
        message: "The username already exists"
      })
      return
    } else {

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      const newUser = await User({
        username,
        password: hashPass
      })

      let savedUser = await newUser.save();

      passport.authenticate('local')(req, res, function () {

        res.status(200).json({
          message: "succesfully signed Up!",
          user: req.user
        })
      })
    }
  } catch (e) {
    console.log(e);
    next(e)
  }
})

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.json({error:info.message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/profile/' + user.username);
    });
  })(req, res, next);
});


router.get('/login-success', (req, res) => {
  // console.log('file: auth.js message:login success');
  res.status(200).json({
    message: 'You are logged in'
  })
})
router.get('/login-fail', (req, res) => {
  // console.log('file: auth.js message: login failed');
  res.status(200).json({
    message: 'You cant Log in'
  })

})

router.get('/logout', (req, res, next) => {
  // console.log('file: auth.js message:current session about to log out',req.session);
  req.session.destroy((err) => {
    res.status(200).json({
      message: 'You logged out succesfully'
    })
  });
});
router.get("/isLogged", (req, res) => {
  if (req.user !== undefined && req.user !== null) {
    // if () {
      res.status(200).json({
        message: 'You are logged in',
        isLogged: true,
        isSeller: req.user.role === 'SELLER',
        user: req.user.username
      })

  } else {
    res.status(200).json({
      message: 'not logged in',
      isLogged: false
    })
  }

})

module.exports = router
