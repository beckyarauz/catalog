
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');


router.post('/add', async (request, res) => {
  try{
    console.log('product info',request.body.product);
    let product = request.body.product;
    let user = await User.findOne({username: request.user.username})
    let seller = {seller: user._id}
    
    let productDB = Object.assign(product,seller);
    let newProduct = await Product({...productDB});
    newProduct.save();

    res.status(200).json({product: productDB})
  } catch(e){
    console.log(e.message);
  }
 
});
router.post('/delete', async (request, res) => {
  try{
    console.log('product info',request.body.product);
    let product = request.body.product;
    let deletedProduct = await Product.findOneAndRemove({_id: product.id})

    res.status(200).json({message: `Product has been deleted, product id: ${deletedProduct}`})
  } catch(e){
    console.log(e.message);
  }
 
});

module.exports = router;