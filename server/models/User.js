const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type:String,
    lowercase: true,
    required: true,
  },
  password: String,
  role: {
    type: String,
    enum: ['ADMIN','BUYER','SELLER'],
    default:'SELLER'
  },
  firstName: String,
  lastName:String,
  email:String,
  phone:String,
  about:String,
  logoUrl:String,
  userPictureUrl: String,
  rating: Number,
  category:String,
  clients:{
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Product'
  },
  policy:String
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
