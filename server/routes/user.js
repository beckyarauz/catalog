/* eslint-disable no-console */
/* eslint no-underscore-dangle: 0 */

const express = require('express');

const User = require('../models/User');

const Product = require('../models/Product');

const router = express.Router();

router.delete('/account/delete', async (request, res) => {
  try {
    const user = request.user._id;
    const userProducts = await User.findOne(
      { _id: user },
      { _id: 0, products: 1 },
    );
    await User.findOneAndRemove({ _id: user });

    request.session.destroy();

    if (request.user.role === 'SELLER') {
      await Product.deleteMany({ seller: user });
      await User.updateMany(
        // this deletes the products from other user's bookmarks
        {},
        { $pull: { bookmarks: { $in: userProducts.products } } },
      );
      await User.updateMany(
        // this the user from the list of following of other Users
        {},
        { $pull: { following: { $in: [user] } } },
      );
    } else {
      await Product.updateMany(
        // deletes the user from the list of users that have bookmarked a product
        {},
        { $pull: { bookmarkedBy: { $in: [user] } } },
      );
      await User.updateMany(
        // deletes the user if he/she was following others from their list of followers
        {},
        { $pull: { followers: { $in: [user] } } },
      );
    }
    res.status(200).json({ message: 'Account Deleted Succesfully' });
  } catch (e) {
    console.log(e.message);
  }
});
router.get('/info', async (request, res) => {
  // this is to render information in manage account page
  try {
    const dbUser = await User.findOne({
      _id: request.user._id,
    })
      .select(
        'username about phone email category logoUrl firstName lastName company address geolocation tags bookmarks',
      )
      .populate('bookmarks');

    res.status(200).json({
      user: dbUser,
    });
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/info/update', async (request, response) => {
  try {
    const updatedUser = request.body.stateInfo;
    if (!updatedUser.password || updatedUser.password === undefined) {
      const dbUser = await User.findOne({
        username: updatedUser.username,
      });
      await dbUser.set({
        username: updatedUser.username,
        lastName: updatedUser.lastName,
        firstName: updatedUser.firstName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        address: updatedUser.address,
        company: updatedUser.company,
        about: updatedUser.about,
        logoUrl: updatedUser.logoUrl,
        userPictureUrl: updatedUser.userPictureUrl,
        category: updatedUser.category,
        geolocation: updatedUser.geolocation,
        tags: updatedUser.tags,
      });
      await dbUser.save();

      response.status(200).json({
        message: 'Changes saved',
        user: dbUser,
      });
    } else {
      const dbUser = await User.findOne({
        username: updatedUser.username,
      });
      await dbUser.set({
        username: updatedUser.username,
        lastName: updatedUser.lastName,
        firstName: updatedUser.firstName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        address: updatedUser.address,
        company: updatedUser.company,
        about: updatedUser.about,
        logoUrl: updatedUser.logoUrl,
        userPictureUrl: updatedUser.userPictureUrl,
        category: updatedUser.category,
        geolocation: updatedUser.geolocation,
        tags: updatedUser.tags,
      });
      await dbUser.save();

      response.status(200).json({
        message: 'Changes saved',
        user: dbUser,
      });
      response.status(200).json({
        message: 'new password encrypted and saved',
      });
    }
  } catch (e) {
    console.log(e.message);
  }
});
router.get('/profile/company/:user', async (request, res) => {
  const username = request.params.user;
  try {
    const dbUser = await User.findOne({
      username,
    })
      .populate({
        path: 'bookmarks',
        select: 'name price seller description imageUrl',
        populate: {
          path: 'seller',
          model: 'User',
          select: {
            _id: 0,
            username: 1,
            logoUrl: 1,
            company: 1,
            email: 1,
          },
        },
      })
      .populate({
        path: 'products',
        select: 'name price seller description imageUrl',
        populate: {
          path: 'seller',
          model: 'User',
          select: {
            _id: 0,
            username: 1,
            logoUrl: 1,
            company: 1,
            email: 1,
          },
        },
      })
      .select(
        'username about phone email category logoUrl userPictureUrl firstName lastName company address geolocation tags bookmarks role',
      );

    let message = null;
    if (dbUser.products.length === 0) {
      message = 'There are no products to be displayed';
    }

    const isOwner = request.user && request.user.username === username;
    const isSeller = dbUser.role === 'SELLER';
    res.status(200).json({
      user: dbUser,
      isOwner,
      isSeller,
      message,
    });
  } catch (e) {
    console.log(e.message);
  }
});
router.get('/profile/user/:user', async (request, res) => {
  const username = request.params.user;
  try {
    const dbUser = await User.findOne({
      username,
    })
      .populate({
        path: 'bookmarks',
        select: 'name price seller description imageUrl',
        populate: {
          path: 'seller',
          model: 'User',
          select: {
            _id: 0,
            username: 1,
            logoUrl: 1,
            company: 1,
            email: 1,
          },
        },
      })
      .select(
        'username about phone email userPictureUrl firstName lastName address geolocation tags bookmarks role',
      );

    const message = null;
    const isOwner = request.user && request.user.username === username;
    const isSeller = dbUser.role === 'SELLER';
    res.status(200).json({
      user: dbUser,
      isOwner,
      isSeller,
      message,
    });
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/bookmark/add', async (request, res) => {
  try {
    const productId = request.body.product;
    const userId = request.user._id;
    const dbUser = await User.findOne({
      _id: userId,
    }).select({
      bookmarks: 1,
      _id: 0,
    });
    if (dbUser === null || dbUser === undefined) {
      res.status(400).json();
      return;
    }
    const userBookmarks = dbUser.bookmarks.map(bookmark => bookmark.toString());
    const index = userBookmarks.indexOf(productId);

    if (index === -1) {
      userBookmarks.push(productId);
      await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          bookmarks: userBookmarks,
        },
      );
      const dbProduct = await Product.findOne({
        _id: productId,
      }).select({
        bookmarkedBy: 1,
        _id: 0,
      });
      const bookmarkedBy = dbProduct.bookmarkedBy.map(user => user.toString());

      bookmarkedBy.push(userId);

      await Product.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          bookmarkedBy,
        },
      );

      res.status(200).json({
        message: 'Product Added to Bookmarks',
      });
      return;
    }
    res.status(200).json({
      message: 'Product is already in your Bookmarks',
    });
  } catch (e) {
    // console.log(e.message);
    res.status(400).json({
      message: 'Bad Request',
    });
  }
});
router.post('/bookmark/remove', async (request, res) => {
  try {
    const productId = request.body.product;
    const userId = request.user._id;
    const dbUser = await User.findOne({
      _id: userId,
    })
      .select({
        bookmarks: 1,
        _id: 0,
      });
    if (dbUser === null || dbUser === undefined) {
      res.status(400).json();
      return;
    }

    const userBookmarks = dbUser.bookmarks.map(bookmark => bookmark.toString());

    const index = userBookmarks.indexOf(productId);
    if (index === -1) {
      res.status(200).json({
        // eslint-disable-next-line quotes
        message: `Product can't be removed because it's not in your bookmarks`,
      });
      return;
    }

    userBookmarks.splice(index, 1);

    const dbProduct = await Product.findOne({
      _id: productId,
    }).select({
      bookmarkedBy: 1,
      _id: 0,
    });
    const bookmarkedBy = dbProduct.bookmarkedBy.map(user => user.toString());

    const userIndex = bookmarkedBy.indexOf(userId);

    bookmarkedBy.splice(userIndex, 1);

    await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        bookmarkedBy,
      },
    );

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        bookmarks: userBookmarks,
      },
    );
    res.status(200).json({
      message: 'Product Removed from your Bookmarks',
    });
  } catch (e) {
    res.status(400).json({
      message: 'Bad Request',
    });
  }
});

module.exports = router;
