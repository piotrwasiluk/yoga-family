const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude test files from Metro's bundling so expo-router's require.context
// doesn't pull them into the production bundle. Jest runs tests via its own
// resolver (see jest.config.js), so this is scoped only to Metro.
config.resolver.blockList = [
  /.*\.test\.(ts|tsx|js|jsx)$/,
  /.*\.spec\.(ts|tsx|js|jsx)$/,
];

module.exports = withNativeWind(config, { input: "./global.css" });
