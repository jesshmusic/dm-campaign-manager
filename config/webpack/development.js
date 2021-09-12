process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const environment = require('./environment');

const isWebpackDevServer = process.env.WEBPACK_DEV_SERVER;

const config = environment.toWebpackConfig();
config.output.filename = 'js/[name]-[hash].js';

//plugins
if (isWebpackDevServer) {
  environment.plugins.append(
    'ReactRefreshWebpackPlugin',
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockPort: 8080,
      },
    }),
  );
}

module.exports = environment.toWebpackConfig();
