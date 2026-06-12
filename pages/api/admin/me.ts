import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/lib/models/Admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Token invalid' });
    }

    await connectDB();
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    return res.status(200).json({
      id: admin._id.toString(),
      email: admin.email,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
