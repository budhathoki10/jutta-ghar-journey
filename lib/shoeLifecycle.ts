import { Shoe } from '@/lib/models/Shoe';

const TRENDING_DAYS = 15;
const TRENDING_DURATION_MS = TRENDING_DAYS * 24 * 60 * 60 * 1000;

export const getTrendingUntil = () => new Date(Date.now() + TRENDING_DURATION_MS);

export const expireOldTrendingShoes = async () => {
  const now = new Date();
  const legacyCutoff = new Date(Date.now() - TRENDING_DURATION_MS);

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
