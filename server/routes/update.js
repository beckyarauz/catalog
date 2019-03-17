
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Define POST route
let saveUser = async (user) => {
  const newUser = User({
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName:user.lastName,
    email:user.email,
    phone:user.phone,
    about:user.description,
    logoUrl:user.logo,
  });

  newUser.save();
}

router.post('/company-info', async (request, response) => {
  
  // console.log('requestBody',request.body);
  let updatedUser = request.body.stateInfo;
  // console.log('updated user:',updatedUser);
  if(!updatedUser.password || updatedUser.password === undefined){
    
    console.log('password not updated',updatedUser.password);
    // let dbUser =  await User.findOneAndUpdate({'username': user.username},{user});
    let dbUser =  await User.find({'username': updatedUser.username});

    // for(field of updatedUser){
    //   console.log('field:',field);
    // }
    console.log('dbUser',dbUser);

    
  } else {
    console.log('password will be updated',updatedUser.password);
    
    response.status(200).json({message: ' new password encrypted and saved'});
     
  }
  

  // saveUser()

});

module.exports = router;