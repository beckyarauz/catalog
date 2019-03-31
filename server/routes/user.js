const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

router.delete('/account/delete', async (request, res) => {
  try {
    let user = request.user._id
    
    let userProducts = await User.findOne({ _id: user},{_id:0,products:1});
    let dbUser = await User.findOneAndRemove({
      _id: user
    })

    request.session.destroy();

    if(request.user.role === 'SELLER'){
      let products = await Product.deleteMany({seller: user});
      await User.updateMany( //this deletes the products from other user's bookmarks
        {},
        { $pull: { bookmarks: { $in: userProducts.products } } }
        )
      let followedBy = await User.updateMany( //this the user from the list of following of other Users
        { },
        { $pull: { following: { $in: [user] } } }
    )
    } else {
      let bookmarkedBy = await Product.updateMany(//deletes the user from the list of users that have bookmarked a product
        { },
        { $pull: { bookmarkedBy: { $in: [user] } } }
      )
      let following = await User.updateMany( // deletes the user if he/she was following others from their list of followers
        { },
        { $pull: { followers: { $in: [user] } } }
      )
    }
    res.status(200).json({message:'Account Deleted Succesfully'})
  } catch (e) {
    console.log(e.message);
  }
});
router.get('/info', async (request, res) => {
  //this is to render information in manage account page
  try {
    let dbUser = await User.findOne({
      _id: request.user._id
    }).select('username about phone email category logoUrl firstName lastName company address geolocation tags bookmarks').populate('bookmarks')
    
    
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
        userPictureUrl: updatedUser.userPictureUrl,
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
router.get('/profile/company/:user', async (request, res) => {
  let username = request.params.user;
  try {
    let dbUser = await User.findOne({
      username
    })
    .populate({
      path:'bookmarks',
      select: 'name price seller description imageUrl',
      populate:{
        path:'seller',
        model:'User',
        select:{'_id':0,'username':1,'logoUrl':1,'company':1,'email':1}
      }
    })
    .populate('products','name price seller description imageUrl')
    .select('username about phone email category logoUrl userPictureUrl firstName lastName company address geolocation tags bookmarks role')
    
    let message = null;
    if(dbUser.products.length === 0){
      message = `There are no products to be displayed`;
    }
    // console.log(dbUser)
    let isOwner = request.user && request.user.username === username;
    let isSeller = dbUser.role === 'SELLER';
    res.status(200).json({
      user: dbUser,
      isOwner,
      isSeller,
      message
    })
  } catch (e) {
    console.log(e.message);
  }
});
router.get('/profile/user/:user', async (request, res) => {
  let username = request.params.user;
  try {
    let dbUser = await User.findOne({
      username
    })
    // .populate('bookmarks','name price seller description imageUrl')
    .populate({
      path:'bookmarks',
      select: 'name price seller description imageUrl',
      populate:{
        path:'seller',
        model:'User',
        select:{'_id':0,'username':1,'logoUrl':1,'company':1,'email':1}
      }
    })
    .select('username about phone email userPictureUrl firstName lastName address geolocation tags bookmarks role')

    let message = null;
    
    // console.log(dbUser)
    let isOwner = request.user && request.user.username === username;
    let isSeller = dbUser.role === 'SELLER';
    res.status(200).json({
      user: dbUser,
      isOwner,
      isSeller,
      message
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