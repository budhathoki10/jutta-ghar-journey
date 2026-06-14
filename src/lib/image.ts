import type { SyntheticEvent } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export const PRODUCT_IMAGE_PLACEHOLDER = '/placeholder.svg';

type OptimizedProductImageOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit';
};

const getApiOrigin = () => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return '';
  }
};

export const resolveImageUrl = (url?: string | null) => {
  const value = url?.trim();

  if (!value) return PRODUCT_IMAGE_PLACEHOLDER;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;

  const origin = getApiOrigin();
  if (!origin) return value;

  return `${origin}${value.startsWith('/') ? value : `/${value}`}`;
};

export const resolveOptimizedProductImageUrl = (
  url?: string | null,
  { width = 640, height, crop = 'fill' }: OptimizedProductImageOptions = {},
) => {
  const resolved = resolveImageUrl(url);
  const marker = '/image/upload/';

  if (!resolved || resolved === PRODUCT_IMAGE_PLACEHOLDER || !resolved.includes(marker)) {
    return resolved;
  }

  try {
    const imageUrl = new URL(resolved);

    if (imageUrl.hostname !== 'res.cloudinary.com') {
      return resolved;
    }

    const [prefix, suffix] = resolved.split(marker);
    const transform = [
      'f_auto',
      'q_auto:eco',
      `c_${crop}`,
      `w_${width}`,
      height ? `h_${height}` : null,
      'dpr_auto',
    ].filter(Boolean).join(',');

    if (!prefix || !suffix || suffix.startsWith(`${transform}/`)) {
      return resolved;
    }

    return `${prefix}${marker}${transform}/${suffix}`;
  } catch {
    return resolved;
  }
};

export const handleProductImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  if (event.currentTarget.src.endsWith(PRODUCT_IMAGE_PLACEHOLDER)) return;
  event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
};
