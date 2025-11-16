module.exports = function override(config) {
  config.plugins = config.plugins || [];

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname, 'src'),
  };

  return config;
};
