module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path aliases — @/ maps to src/
      ['module-resolver', {
        root:    ['./'],
        alias:   { '@': './src' },
      }],
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ],
  };
};
