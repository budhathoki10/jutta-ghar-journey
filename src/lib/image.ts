import type { SyntheticEvent } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export const PRODUCT_IMAGE_PLACEHOLDER = '/placeholder.svg';

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

export const handleProductImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  if (event.currentTarget.src.endsWith(PRODUCT_IMAGE_PLACEHOLDER)) return;
  event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
};
