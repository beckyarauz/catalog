
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
  try{
// console.log('requestBody',request.body);
let updatedUser = request.body.stateInfo;
// console.log('updated user:',updatedUser);
if(!updatedUser.password || updatedUser.password === undefined){
  
  console.log('password not updated',updatedUser.password);
  // let dbUser =  await User.findOneAndUpdate({'username': user.username},{user});
  let dbUser =  await User.findOne({'username': updatedUser.username});
  console.log('updated user:',updatedUser);
  console.log('DBuser:',dbUser);
  await dbUser.set({
    username: updatedUser.username,
    lastName: updatedUser.lastName,
    firstName: updatedUser.firstName,
    phone:updatedUser.phone,
    email:updatedUser.email,
    about: updatedUser.about,
    logoUrl: updatedUser.logoUrl,
    category: updatedUser.category,
    geolocation: updatedUser.geolocation
  })
  await dbUser.save();

  response.status(200).json({message: 'Changes saved',user:dbUser});
  // for(field of updatedUser){
  //   console.log('field:',field);
  // }
  console.log('dbUser',dbUser);

  
} else {
  console.log('password will be updated',updatedUser.password);
  
  response.status(200).json({message: ' new password encrypted and saved'});
   
}


// saveUser()
  } catch(e){
    console.log(e.message)
  }
  

});

module.exports = router;