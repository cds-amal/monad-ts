/**
 * Stub for @noble/hashes - UI doesn't need actual hashing
 * These functions are only used by @metamask/utils for address checksums
 * which we don't use in our UI components
 */

// sha256 stub
const sha256 = (data) => new Uint8Array(32);

// keccak256 stub (sha3)
const keccak_256 = (data) => new Uint8Array(32);

// Export for both named and default imports
module.exports = { sha256, keccak_256 };
module.exports.sha256 = sha256;
module.exports.keccak_256 = keccak_256;
module.exports.default = { sha256, keccak_256 };
