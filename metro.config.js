const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support .web.ts platform-specific files
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
