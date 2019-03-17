
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/account-info', async (request, res) => {
  try{
    console.log('info',request.user.username);
    let dbUser = await User.findOne({username:request.user.username})
    let username, about, phone,email,category,logoUrl,firstName,lastName;
  
    ({username, about, phone,email,category,firstName,lastName,logoUrl} = dbUser);
  
    let userInfo = {username, about, phone,email,category,logoUrl,firstName,lastName}
    res.status(200).json({user: userInfo})
  } catch(e){
    console.log(e.message);
  }
 
});

module.exports = router;