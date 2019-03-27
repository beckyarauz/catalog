
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/:user/all', async (req,res) => {
  try{
    let user = req.params.user;
    // console.log('body',req.params);
  
    let userId = await User.findOne({username: user}).select({_id:1});
  
    // console.log('userId',userId);
    let products = await Product.find({seller: userId._id}).select('tags name price description imageUrl')
    // console.log('products',products);
  
    if(products.length > 0){
      res.status(200).json({message:'products', products:products})
    } else {
      res.status(200).json({error:'No Products found'})
    }
  } catch(e){
    console.log(e.message)
  }
})
router.post('/edit', async (request, res) => {
  try{
    let product = request.body.product;
    console.log('request product',product)
    let dbProduct = await Product.findOneAndUpdate({_id: request.body.product._id},{
      name: request.body.product.name,
      description: request.body.product.description,
      price: request.body.product.price,
      tags: request.body.product.tags,
      imageUrl: request.body.product.imageUrl,
    })
    res.status(200).json({message:'Product Updated',product: dbProduct})
  } catch(e){
    console.log(e.message);
    res.status(400).json({message:'Bad Request'})
  }
 
});
router.post('/add', async (request, res) => {
  try{
    let product = request.body.product;
    let user = await User.findOne({username: request.user.username}).select({products:1});
   
    let productArray = [...user.products];

    let seller = {seller: user._id}
    
    let productDB = await Object.assign(product,seller);
    let newProduct = await Product({...productDB});
    let savedProduct = await newProduct.save();

    productArray.push(savedProduct._id);

    await User.findOneAndUpdate({username: request.user.username},{products:productArray})

    res.status(200).json({message:'Product Saved',product: savedProduct})
  } catch(e){
    console.log(e.message);
    res.status(400).json({message:'Bad Request'})
  }
 
});
router.post('/delete', async (request, res) => {
  console.log('product.js /delete product info',request.body.product);
  try{
    let product = request.body.product;
    let deletedProduct = await Product.findOneAndRemove({_id: product})

    let user = await User.findOne({_id:request.user._id});

    let products = [...user.products];

    let found = products.filter(product => product._id === deletedProduct._id).map(product => products.indexOf(product));
   
    products.splice(found[0],1);
    
    let updateUser = await User.findOneAndUpdate({_id:request.user._id},{products})

    res.status(200).json({message: `Product has been deleted: ${deletedProduct.name}`})
  } catch(e){
    console.log(e.message);
    res.status(400).json({message: `Product couldn't be deleted`})
  }
 
});

module.exports = router;