module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '@components': './src/components',
          '@lib': './src/lib',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};
