process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { devServer, merge } = require('shakapacker');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpackConfig = require('./environment');

const isWebpackDevServer = process.env.WEBPACK_DEV_SERVER;

let developmentConfig = {
  output: {
    filename: 'js/[name]-[contenthash].js',
  },
};

if (isWebpackDevServer) {
  developmentConfig = merge(developmentConfig, {
    plugins: [
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockPort: devServer.port,
        },
      }),
    ],
  });
}

module.exports = merge(webpackConfig, developmentConfig);
