
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
      let dbUsers = await User.find({category:category}).select('company about category geolocation')
      if(dbUsers !== null && dbUsers !== undefined && dbUsers.length > 0){
        res.status(200).json({companies: dbUsers})
      } else {
        res.status(204).json()
      }
  } catch(e){
    console.log(e.message);
  }

})

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return Number.parseFloat(Number.parseFloat(d).toFixed(2));
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

router.get('/all/', async (req,res) => {
  try{
    let location = req.query;
    console.log('query location',location)
      let dbUsers = await User.find().select('company about category geolocation');
      console.log(dbUsers);
      let filtered = dbUsers.filter(user => {
        let dbLocation = user.geolocation;
        let distance = getDistanceFromLatLonInKm(location.latitude,location.longitude,dbLocation.latitude,dbLocation.longitude);
        // console.log('distance:',distance)
        // return user.geolocation
        return distance < 30 && distance > 0 ;
      })
      console.log(filtered)

      // let nearCompanies = {...filtered}
      if(filtered.length > 0){
        res.status(200).json({companies: filtered})
      } else {
        res.status(204).json()
      }
      
      
  } catch(e){
    console.log(e.message);
  }

})

module.exports = router;