import { randomBytes } from "node:crypto";

export const GIFT_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateGiftCode(): string {
  let suffix = "";
  // Rejection sampling avoids bias when mapping bytes to the alphabet.
  const limit = 256 - (256 % GIFT_ALPHABET.length);
  while (suffix.length < 10) {
    for (const byte of randomBytes(16)) {
      if (byte < limit) suffix += GIFT_ALPHABET[byte % GIFT_ALPHABET.length];
      if (suffix.length === 10) break;
    }
  }
  return `GIFT-${suffix}`;
}
