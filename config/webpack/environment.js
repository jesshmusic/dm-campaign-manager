const { generateWebpackConfig, merge } = require('shakapacker');
const webpack = require('webpack');

const webpackConfig = generateWebpackConfig();

const customConfig = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery/src/jquery',
      jQuery: 'jquery/src/jquery',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

module.exports = merge(webpackConfig, customConfig);
