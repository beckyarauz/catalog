
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/info', async (request, res) => {
  try{
    console.log('file: user.js GET /accountInfo request.user',request.user.username);
    let dbUser = await User.findOne({username:request.user.username}).select('username about phone email category logoUrl firstName lastName company address geolocation tags')
    // let isOwner = request.user && request.user === 
    res.status(200).json({user: dbUser, isOwner})
  } catch(e){
    console.log(e.message);
  }
});
router.get('/profile/:user', async (request, res) => {
  let username = request.params.user;
  // console.log(request.params.user)
  try{
    console.log('file: user.js GET /accountInfo reques.user',username);
    let dbUser = await User.findOne({username}).select('username about phone email category logoUrl firstName lastName company address geolocation tags')
    let isOwner = request.user && request.user.username === username;
    res.status(200).json({user: dbUser, isOwner})
  } catch(e){
    console.log(e.message);
  }
});

module.exports = router;