
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/info', async (request, res) => {
  try{
    console.log('file: user.js GET /accountInfo reques.user',request.user.username);
    let dbUser = await User.findOne({username:request.user.username}).select('username about phone email category logoUrl firstName lastName company address geolocation')
    // let username, about, phone,email,category,logoUrl,firstName,lastName,company,address;
  
    // ({username, about, phone,email,category,firstName,lastName,logoUrl,company,address} = dbUser);
  
    // let userInfo = {username, about, phone,email,category,logoUrl,firstName,lastName,company,address}
    res.status(200).json({user: dbUser})
  } catch(e){
    console.log(e.message);
  }
 
});

module.exports = router;