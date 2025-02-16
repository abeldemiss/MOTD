const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable require.context
config.resolver.requireContext = true;

module.exports = config; 