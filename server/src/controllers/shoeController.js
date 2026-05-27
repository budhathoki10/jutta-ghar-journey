const Shoe = require('../models/Shoe');

const TRENDING_DAYS = 15;
const trendingDurationMs = TRENDING_DAYS * 24 * 60 * 60 * 1000;

const getTrendingUntil = () => new Date(Date.now() + trendingDurationMs);

const expireOldTrendingShoes = async () => {
  const now = new Date();
  const legacyCutoff = new Date(Date.now() - trendingDurationMs);

  await Shoe.updateMany(
    {
      trending: true,
      $or: [
        { trendingUntil: { $lte: now } },
        {
          trendingUntil: { $exists: false },
          createdAt: { $lte: legacyCutoff },
        },
        {
          trendingUntil: null,
          createdAt: { $lte: legacyCutoff },
        },
      ],
    },
    {
      $set: { trending: false },
      $unset: { trendingUntil: '' },
    }
  );
};

exports.expireOldTrendingShoes = expireOldTrendingShoes;

const cleanImages = (images = []) =>
  Array.isArray(images)
    ? images
        .filter((image) => image && typeof image.url === 'string' && image.url.trim())
        .map((image) => ({
          url: image.url.trim(),
          publicId: image.publicId || '',
        }))
    : [];

const buildShoePayload = (body) => ({
  name: body.name?.trim(),
  gender: body.gender,
  subcategory: body.subcategory?.trim(),

  brand: body.brand?.trim() || '',
  branded: Boolean(body.branded),
  trending: Boolean(body.trending),
  isFeatured: Boolean(body.isFeatured),

  description: body.description?.trim() || '',
  price: body.price === '' || body.price === undefined ? undefined : Number(body.price),

  sizes: Array.isArray(body.sizes)
    ? body.sizes.map(Number).filter(Number.isFinite)
    : [],

  images: cleanImages(body.images),
});

exports.getAllShoes = async (req, res) => {
  try {
    await expireOldTrendingShoes();

    const { gender, subcategory, search, trending } = req.query;
    const filter = {};

    if (gender) filter.gender = gender;
    if (subcategory) filter.subcategory = subcategory;
    if (trending === 'true') filter.trending = true;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    const shoes = await Shoe.find(filter).sort({ createdAt: -1 });

    res.json({
      count: shoes.length,
      data: shoes,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getShoeById = async (req, res) => {
  try {
    await expireOldTrendingShoes();

    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({
        message: 'Shoe not found',
      });
    }

    res.json(shoe);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.createShoe = async (req, res) => {
  try {
    const payload = {
      ...buildShoePayload(req.body),
      trending: true,
      trendingUntil: getTrendingUntil(),
    };

    if (!payload.name) {
      return res.status(400).json({
        message: 'Product name is required.',
      });
    }

    if (!payload.gender) {
      return res.status(400).json({
        message: 'Product gender is required.',
      });
    }

    if (!payload.subcategory) {
      return res.status(400).json({
        message: 'Product subcategory is required.',
      });
    }

    if (!payload.images.length) {
      return res.status(400).json({
        message: 'At least one product image is required.',
      });
    }

    const shoe = await Shoe.create(payload);

    res.status(201).json(shoe);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.updateShoe = async (req, res) => {
  try {
    await expireOldTrendingShoes();

    const payload = buildShoePayload(req.body);

    if (!payload.name) {
      return res.status(400).json({
        message: 'Product name is required.',
      });
    }

    if (!payload.images.length) {
      return res.status(400).json({
        message: 'At least one product image is required.',
      });
    }

    const existingShoe = await Shoe.findById(req.params.id);

    if (!existingShoe) {
      return res.status(404).json({
        message: 'Shoe not found',
      });
    }

    const update = {
      $set: {
        ...payload,
        ...(payload.trending
          ? {
              trendingUntil:
                existingShoe.trending && existingShoe.trendingUntil
                  ? existingShoe.trendingUntil
                  : getTrendingUntil(),
            }
          : {}),
      },
      ...(payload.trending ? {} : { $unset: { trendingUntil: '' } }),
    };

    const shoe = await Shoe.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    res.json(shoe);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);

    if (!shoe) {
      return res.status(404).json({
        message: 'Shoe not found',
      });
    }

    res.json({
      message: 'Shoe deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
