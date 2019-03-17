
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/account-info', async (request, response) => {
  console.log(request.user);
  // console.log(response.user);
  // User.find({})
});

module.exports = router;