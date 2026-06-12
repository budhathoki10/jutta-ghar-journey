import mongoose, { Schema, Document } from 'mongoose';

interface IImage {
  url: string;
  publicId?: string;
}

export interface IShoe extends Document {
  name: string;
  gender: 'male' | 'female' | 'unisex';
  subcategory: string;
  brand?: string;
  branded?: boolean;
  trending?: boolean;
  trendingUntil?: Date;
  description?: string;
  price?: number;
  sizes?: number[];
  images?: IImage[];
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false }
);

const ShoeSchema = new Schema<IShoe>(
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

export const Shoe = mongoose.models.Shoe || mongoose.model<IShoe>('Shoe', ShoeSchema);
