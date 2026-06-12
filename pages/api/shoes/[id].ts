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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      await connectDB();
      await expireOldTrendingShoes();
      const shoe = await Shoe.findById(id);

      if (!shoe) {
        return res.status(404).json({ message: 'Shoe not found' });
      }

      return res.status(200).json(shoe);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
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
      await expireOldTrendingShoes();

      const existingShoe = await Shoe.findById(id);

      if (!existingShoe) {
        return res.status(404).json({ message: 'Shoe not found' });
      }

      const payload = { ...req.body };
      if ('name' in payload) {
        payload.name = formatProductName(payload.name);
      }

      const update: any = { $set: payload };

      if (payload.trending === true) {
        update.$set.trendingUntil =
          existingShoe.trending && existingShoe.trendingUntil
            ? existingShoe.trendingUntil
            : getTrendingUntil();
      }

      if (payload.trending === false) {
        update.$unset = { trendingUntil: '' };
      }

      const shoe = await Shoe.findByIdAndUpdate(id, update, { new: true });

      if (!shoe) {
        return res.status(404).json({ message: 'Shoe not found' });
      }

      return res.status(200).json(shoe);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
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

      const shoe = await Shoe.findByIdAndDelete(id);

      if (!shoe) {
        return res.status(404).json({ message: 'Shoe not found' });
      }

      return res.status(200).json({ message: 'Shoe deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
