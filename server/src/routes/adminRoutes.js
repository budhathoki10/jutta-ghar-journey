const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Register is intended for initial setup; remove or protect in production
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Example protected endpoint to get current admin
router.get('/me', protect, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

module.exports = router;
