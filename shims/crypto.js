// Shim for @noble/hashes/crypto - not needed for UI
module.exports = {
  crypto: {
    getRandomValues: (arr) => arr,
    randomUUID: () => 'mock-uuid',
  },
  randomBytes: (n) => new Uint8Array(n),
};
