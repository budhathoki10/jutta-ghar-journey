const Shoe = require('../models/Shoe');

// GET /api/shoes
exports.getAllShoes = async (req, res) => {
  try {
    const { gender, subcategory, search } = req.query;
    const filter = {};
    if (gender) filter.gender = gender;
    if (subcategory) filter.subcategory = subcategory;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const shoes = await Shoe.find(filter).sort({ createdAt: -1 });
    res.json({ count: shoes.length, data: shoes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/shoes/:id
exports.getShoeById = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/shoes
exports.createShoe = async (req, res) => {
  try {
    const payload = req.body;
    const shoe = new Shoe(payload);
    await shoe.save();
    res.status(201).json(shoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/shoes/:id
exports.updateShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/shoes/:id
exports.deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json({ message: 'Shoe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
