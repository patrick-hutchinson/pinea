import {retryGiftOrder} from '@/lib/gifts/retry.ts';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Wait for the result so operators receive the actual processing error, not an acknowledgement.
export const POST = retryGiftOrder;
