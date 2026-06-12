import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import { Shoe } from '@/lib/models/Shoe';
import { verifyToken } from '@/lib/auth';
import { expireOldTrendingShoes, getTrendingUntil } from '@/lib/shoeLifecycle';
import { formatProductName } from '@/lib/productText';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      await expireOldTrendingShoes();

      const { search, gender, subcategory, trending, limit = 50, skip = 0 } = req.query;

      let query: any = {};

      if (search) {
        query.$text = { $search: search as string };
      }
      if (gender) {
        query.gender = gender;
      }
      if (subcategory) {
        query.subcategory = subcategory;
      }
      if (trending === 'true') {
        query.trending = true;
      }

      const shoes = await Shoe.find(query)
        .limit(Math.min(parseInt(limit as string) || 50, 100))
        .skip(parseInt(skip as string) || 0)
        .sort({ createdAt: -1 });
      const total = await Shoe.countDocuments(query);

      return res.status(200).json({ data: shoes, shoes, total });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Token invalid' });
      }

      await connectDB();

      const payload = {
        ...req.body,
        name: formatProductName(req.body?.name),
      };

      const shoe = await Shoe.create({
        ...payload,
        trending: true,
        trendingUntil: getTrendingUntil(),
      });

      return res.status(201).json(shoe);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
