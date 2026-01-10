export const calculateShipping = qty => {
  if (qty === 0) return 0;
  if (qty <= 3) return 5.0; // 1-3 items
  if (qty <= 6) return 8.0; // 4-6 items
  if (qty <= 10) return 12.0; // 7-10 items
  if (qty <= 15) return 18.0; // 11-15 items
  return 25.0; // 15+ items
};
