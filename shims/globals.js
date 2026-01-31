/**
 * Global polyfills for React Native
 * Must be imported FIRST before any other code.
 *
 * Required for MetaMask Design System dependencies that assume Node.js environment.
 */

// Buffer polyfill
global.Buffer = require('buffer').Buffer;

// Process polyfill with browser flags
global.process = global.process || require('process');
process.browser = true;

// Some libs branch on node version existence
global.process.version = global.process.version || 'v16.0.0';

// Some stream/http shims look at location.protocol
global.location = global.location || { protocol: 'file:' };
