
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
let saveUser = async (user) => {
  const newUser = User({
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    about: user.description,
    logoUrl: user.logo,
  });

  newUser.save();
}

router.post('/update', async (request, response) => {
  try {
    let updatedUser = request.body.stateInfo;
    if (!updatedUser.password || updatedUser.password === undefined) {
      let dbUser = await User.findOne({
        'username': updatedUser.username
      });
      await dbUser.set({
        username: updatedUser.username,
        lastName: updatedUser.lastName,
        firstName: updatedUser.firstName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        about: updatedUser.about,
        logoUrl: updatedUser.logoUrl,
        category: updatedUser.category,
        geolocation: updatedUser.geolocation,
        tags: updatedUser.tags
      })
      await dbUser.save();

      response.status(200).json({
        message: 'Changes saved',
        user: dbUser
      });
    } else {
      console.log('password will be updated', updatedUser.password);
      response.status(200).json({
        message: 'new password encrypted and saved'
      });
    }
  } catch (e) {
    console.log(e.message)
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