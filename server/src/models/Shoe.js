const mongoose = require('mongoose');
const { string } = require('zod');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String }
});

const ShoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'kids'], required: true },
  subcategory: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  sizes: [{ type: String }],
  images: [ImageSchema],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shoe', ShoeSchema);
