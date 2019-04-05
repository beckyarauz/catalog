/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

const express = require('express');

const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/:user/all', async (req, res) => {
  try {
    const { user } = req.params;
    const userId = await User.findOne({ username: user }).select({ _id: 1 });
    const products = await Product.find({ seller: userId._id })
      .select('tags name price description imageUrl seller')
      .populate(
        {
          path: 'seller',
          model: 'User',
          select: {
            _id: 0, username: 1, logoUrl: 1, company: 1, email: 1,
          },
        },
      );

    if (products.length > 0) {
      res.status(200).json({ message: 'products', products });
    } else {
      res.status(200).json({ error: 'No Products found' });
    }
  } catch (e) {
    console.log(e.message);
  }
});
router.post('/edit', async (request, res) => {
  try {
    const { product } = request.body;
    const dbProduct = await Product.findOneAndUpdate({ _id: product._id }, {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imageUrl: product.imageUrl,
    });
    console.log('edited', dbProduct);
    res.status(200).json({ message: 'Product Updated', product: dbProduct });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: 'Bad Request' });
  }
});

router.post('/add', async (request, res) => {
  try {
    const { product } = request.body;
    const user = await User.findOne({ username: request.user.username }).select({ products: 1 });

    const productArray = [...user.products];

    const seller = { seller: user._id };

    const productDB = await Object.assign(product, seller);
    const newProduct = await Product({ ...productDB });
    const savedProduct = await newProduct.save();

    productArray.push(savedProduct._id);

    await User.findOneAndUpdate({ username: request.user.username }, { products: productArray });

    res.status(200).json({ message: 'Product Saved', product: savedProduct });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: 'Bad Request' });
  }
});

router.post('/delete', async (request, res) => {
  try {
    const { product } = request.body;
    const deletedProduct = await Product.findOneAndRemove({ _id: product });

    const user = await User.findOne({ _id: request.user._id });

    const products = [...user.products];

    const found = products.filter(prod => prod._id === deletedProduct._id)
      .map(prod => products.indexOf(prod));

    products.splice(found[0], 1);

    await User.findOneAndUpdate({ _id: request.user._id }, { products });

    await User.updateMany(
      { },
      { $pull: { bookmarks: { $in: [product] } } },
    );

    res.status(200).json({ message: `Product has been deleted: ${deletedProduct.name}` });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: 'Product couldn\'t be deleted' });
  }
});

module.exports = router;
