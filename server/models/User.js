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
    default:'BUYER'
  },
  firstName: String,
  geolocation: Object,
  company: String,
  address: String,
  lastName:String,
  email:String,
  tags:[Object],
  phone:String,
  bookmarks:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
  about:String,
  logoUrl:String,
  followers:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  following:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  userPictureUrl: String,
  rating: Number,
  category:String,
  clients:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  policy:String
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
