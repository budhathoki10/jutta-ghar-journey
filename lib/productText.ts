export const formatProductName = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase();

  return normalized.replace(/(^|[\s/-])([a-z])/g, (_match, separator, letter) => {
    return `${separator}${letter.toUpperCase()}`;
  });
};
