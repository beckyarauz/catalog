const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  category: String,
  description: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  price: Number,
  imageUrl: String,
  tags: [String],
  bookmarkedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
