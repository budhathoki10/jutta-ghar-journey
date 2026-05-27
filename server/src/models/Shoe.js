const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false }
);

const ShoeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'unisex'], required: true },
    subcategory: { type: String, required: true, trim: true },

    brand: { type: String, trim: true, default: '' },
    branded: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    trendingUntil: { type: Date },

    description: { type: String, trim: true, default: '' },
    price: { type: Number, min: 0 },
    sizes: [{ type: Number }],

    images: { type: [ImageSchema], default: [] },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ShoeSchema.index({ name: 'text', brand: 'text', subcategory: 'text' });
ShoeSchema.index({ gender: 1, subcategory: 1, createdAt: -1 });
ShoeSchema.index({ trending: 1, trendingUntil: 1, createdAt: -1 });

module.exports = mongoose.model('Shoe', ShoeSchema);
