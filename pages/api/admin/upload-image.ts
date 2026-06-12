import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'shoe_shop',
      resource_type: 'auto',
      use_filename: true,
    });

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.originalFilename,
      cloudinaryUrl: result.secure_url,
    });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
}
