import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/lib/models/Admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (process.env.ENABLE_ADMIN_REGISTER !== 'true') {
      return res.status(403).json({ message: 'Admin registration is disabled' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    await connectDB();

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await Admin.create({ email, password: hashed });

    return res.status(201).json({ message: 'Admin registered' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
