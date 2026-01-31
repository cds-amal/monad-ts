/**
 * Crypto shim for React Native
 *
 * Provides globalThis.crypto.getRandomValues for @noble/hashes.
 * Must be imported FIRST, before any library that uses crypto.
 */

// This polyfills global.crypto.getRandomValues
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Make Buffer globally available (some libs expect it)
global.Buffer = Buffer;

// @noble/hashes/crypto.js checks globalThis.crypto, not global.crypto
// Some RN/Hermes combos expose global.crypto but not globalThis.crypto
if (global.crypto && !globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = global.crypto;
}

// Debug logging (remove after confirming it works)
console.log('has globalThis.crypto?', !!globalThis.crypto);
console.log('has getRandomValues?', !!globalThis.crypto?.getRandomValues);
