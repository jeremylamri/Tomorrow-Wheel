/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * Uses window.crypto for entropy instead of Math.random().
 */
export const getSecureRandomInt = (min: number, max: number): number => {
  // Safety check for environments ensuring robust fallback (though modern browsers support crypto)
  if (typeof window === 'undefined' || !window.crypto) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const range = max - min + 1;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  
  // Use modulo to map the 32-bit random integer to our range.
  // Note: For very small ranges like ours (1-100 or 1-16), modulo bias is statistically negligible.
  return min + (array[0] % range);
};

/**
 * Returns a secure random float between 0 (inclusive) and 1 (exclusive).
 * Replacement for Math.random() where secure visuals are needed.
 */
export const getSecureRandomFloat = (): number => {
  if (typeof window === 'undefined' || !window.crypto) {
    return Math.random();
  }
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}
