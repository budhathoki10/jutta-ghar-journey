import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const imageId = Array.isArray(id) ? id[0] : id;

  if (!imageId || !mongoose.Types.ObjectId.isValid(imageId)) {
    return res.status(400).json({ message: 'Invalid image id' });
  }

  try {
    const connection = await connectDB();
    const db = connection.connection.db;
    const objectId = new mongoose.Types.ObjectId(imageId);
    const files = db.collection('uploads.files');
    const file = await files.findOne({ _id: objectId });

    if (!file) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', String(file.length));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
    const stream = bucket.openDownloadStream(objectId);

    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Image not found' });
      } else {
        res.end();
      }
    });

    stream.pipe(res);
  } catch (err: any) {
    console.error('Image fetch error:', err);
    return res.status(500).json({ message: err.message || 'Failed to load image' });
  }
}
