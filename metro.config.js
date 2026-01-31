const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Node.js core module polyfills/stubs
config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process'),
  assert: require.resolve('empty-module'),
  http: require.resolve('empty-module'),
  https: require.resolve('empty-module'),
  os: require.resolve('empty-module'),
  url: require.resolve('empty-module'),
  zlib: require.resolve('empty-module'),
  path: require.resolve('empty-module'),
  fs: require.resolve('empty-module'),
  net: require.resolve('empty-module'),
  tls: require.resolve('empty-module'),
  child_process: require.resolve('empty-module'),
};

// Stub for @noble/hashes if needed
const nobleHashesStub = path.resolve(__dirname, 'shims/noble-hashes.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect @noble/hashes to stub (UI doesn't need real crypto)
  if (moduleName.startsWith('@noble/hashes')) {
    return {
      filePath: nobleHashesStub,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
