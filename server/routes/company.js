
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/info', async (request, res) => {
  try{
    // console.log('file: company.js GET /info request.user',request.user.username);
    let dbUsers = await User.find({category:request.company.name}).select('company about')
    res.status(200).json({companies: dbUsers})
  } catch(e){
    console.log(e.message);
  }
 
});

router.get('/:category/all', async (req,res) => {
  let category = req.params.category;
  try{
    // console.log('file: company.js GET /info req.params.category',category);
    let dbUsers = await User.find({category:category}).select('company about')
    if(dbUsers !== null && dbUsers !== undefined && dbUsers.length > 0){
      res.status(200).json({companies: dbUsers})
    } else {
      res.status(204).json()
    }
  } catch(e){
    console.log(e.message);
  }

})

module.exports = router;