export type ShoeImage = {
  url: string;
  publicId?: string;
};

export type Shoe = {
  _id: string;
  name: string;
  gender?: 'male' | 'female' | 'unisex' | string;
  subcategory?: string;
  brand?: string;
  branded?: boolean;
  trending?: boolean;
  trendingUntil?: string;
  isFeatured?: boolean;
  price?: number | string;
  description?: string;
  sizes?: number[];
  images?: ShoeImage[];
  sold?: number;
  soldOut?: boolean;
  createdAt?: string;
};

export type ShoeInput = Omit<Partial<Shoe>, '_id' | 'createdAt'>;
