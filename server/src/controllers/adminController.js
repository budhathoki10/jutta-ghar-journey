const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

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

    const bufferStream = Readable.from([req.file.buffer]);
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'shoe-shop/shoes', resource_type: 'image' }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
      }
      res.json({ url: result.secure_url, publicId: result.public_id });
    });

    bufferStream.pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
