const express = require('express');
const router = express.Router();
const shoeController = require('../controllers/shoeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', shoeController.getAllShoes);
router.get('/:id', shoeController.getShoeById);
router.post('/', protect, shoeController.createShoe);
router.put('/:id', protect, shoeController.updateShoe);
router.delete('/:id', protect, shoeController.deleteShoe);

module.exports = router;
