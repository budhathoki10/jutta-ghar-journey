const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const admin = new Admin({ email, password: hashed });
    await admin.save();
    res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    // Upload to Cloudinary using buffer with signed upload
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'shoe_shop',
        resource_type: 'auto',
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Upload failed', error: error.message });
        }

        res.json({
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file.originalname,
          cloudinaryUrl: result.secure_url
        });
      }
    );

    // Pipe the buffer to Cloudinary
    const bufferStream = Readable.from([req.file.buffer]);
    bufferStream.pipe(uploadStream);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    // Return a single generic message to avoid revealing which part failed
    if (!admin) return res.status(401).json({ message: 'Invalid email' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
