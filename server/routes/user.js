const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// let saveUser = async (user) => {
//   const newUser = User({
//     username: user.username,
//     password: user.password,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     phone: user.phone,
//     about: user.description,
//     logoUrl: user.logo,
//   });

//   newUser.save();
// }

router.get('/info', async (request, res) => {
  //this is to render information in manage account page
  try {
    let dbUser = await User.findOne({
      _id: request.user._id
    }).select('username about phone email category logoUrl firstName lastName company address geolocation tags')
    
    res.status(200).json({
      user: dbUser,
      isOwner
    })
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/info/update', async (request, response) => {
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
  try {
    let dbUser = await User.findOne({
      username
    }).select('username about phone email category logoUrl firstName lastName company address geolocation tags bookmarks')
    let isOwner = request.user && request.user.username === username;
    res.status(200).json({
      user: dbUser,
      isOwner
    })
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/bookmark/add', async (request, res) => {
  try {
    let productId = request.body.product;
    let userId = request.user._id;
    let dbUser = await User.findOne({
      _id: userId
    }).select({
      bookmarks: 1,
      _id: 0
    });
    if (dbUser === null || dbUser === undefined) {
      res.status(400).json();
      return;
    }
    let userBookmarks = dbUser.bookmarks.map(bookmark => bookmark.toString());
    let index = userBookmarks.indexOf(productId);

    if (index === -1) {
      userBookmarks.push(productId);
      await User.findByIdAndUpdate({
        _id: userId
      }, {
        bookmarks: userBookmarks
      });
      let dbProduct = await Product.findOne({
        _id: productId
      }).select({
        bookmarkedBy: 1,
        _id: 0
      });
      let bookmarkedBy = dbProduct.bookmarkedBy.map(user => user.toString());

      bookmarkedBy.push(userId);

      let dbProductUpdated = await Product.findOneAndUpdate({
        _id: productId
      }, {
        bookmarkedBy
      })

      res.status(200).json({
        message: 'Product Added to Bookmarks'
      })
      return;
    }
    res.status(200).json({
      message: 'Product is already in your Bookmarks'
    })

  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: 'Bad Request'
    })
  }
});
router.post('/bookmark/remove', async (request, res) => {
  try {
    let productId = request.body.product;
    let userId = request.user._id;
    let dbUser = await User.findOne({
      _id: userId
    }).select({
      bookmarks: 1,
      _id: 0
    });
    if (dbUser === null || dbUser === undefined) {
      res.status(400).json();
      return;
    }

    let userBookmarks = dbUser.bookmarks.map(bookmark => bookmark.toString());

    let index = userBookmarks.indexOf(productId);
    if (index === -1) {
      res.status(200).json({
        message: `Product can't be removed because it's not in your bookmarks`
      })
      return;
    }

    userBookmarks.splice(index, 1);

    let dbProduct = await Product.findOne({
      _id: productId
    }).select({
      bookmarkedBy: 1,
      _id: 0
    });
    let bookmarkedBy = dbProduct.bookmarkedBy.map(user => user.toString());

    let userIndex = bookmarkedBy.indexOf(userId);

    bookmarkedBy.splice(userIndex, 1);

    await Product.findOneAndUpdate({
      _id: productId
    }, {
      bookmarkedBy
    })

    await User.findByIdAndUpdate({
      _id: userId
    }, {
      bookmarks: userBookmarks
    });
    res.status(200).json({
      message: 'Product Removed from your Bookmarks'
    })
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: 'Bad Request'
    })
  }
});

module.exports = router;