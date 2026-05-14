const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Readable } = require('stream');

// Create GridFS bucket
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

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

    if (!gfs) return res.status(500).json({ message: 'GridFS not initialized' });

    const filename = `shoe-${Date.now()}-${req.file.originalname}`;
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    const bufferStream = Readable.from([req.file.buffer]);
    bufferStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      res.json({
        url: `/api/admin/image/${uploadStream.id}`,
        publicId: uploadStream.id.toString(),
        filename: filename
      });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({ message: 'Upload failed', error: error.message });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    if (!gfs) return res.status(500).json({ message: 'GridFS not initialized' });

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image not found' });
    });

    downloadStream.pipe(res);
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
