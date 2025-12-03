const { generateWebpackConfig, merge } = require('shakapacker');
const webpack = require('webpack');

const webpackConfig = generateWebpackConfig();

// Find and modify CSS loaders for backward compatibility with old codebase
// - Enable default exports for CSS modules (namedExport: false)
// - Don't resolve absolute URLs (they point to public/ folder)
// - Silence Sass deprecation warnings for @import and Bootstrap color functions
function modifyCssLoaders(rules) {
  rules.forEach((rule) => {
    // Handle oneOf array (shakapacker uses this for CSS rules)
    if (rule.oneOf) {
      modifyCssLoaders(rule.oneOf);
      return;
    }

    // Check if this rule has 'use' array with css-loader or sass-loader
    if (rule.use && Array.isArray(rule.use)) {
      rule.use.forEach((loader) => {
        const loaderObj = typeof loader === 'string' ? null : loader;

        // Modify css-loader
        if (
          loaderObj &&
          loaderObj.loader &&
          loaderObj.loader.includes('css-loader') &&
          !loaderObj.loader.includes('postcss')
        ) {
          if (!loaderObj.options) loaderObj.options = {};

          // Don't resolve absolute URLs (they're public paths like /images/...)
          loaderObj.options.url = {
            filter: (url) => {
              // Don't resolve absolute URLs - they reference public folder assets
              if (url.startsWith('/')) {
                return false;
              }
              return true;
            },
          };

          // Enable default exports for CSS modules (backward compatibility)
          if (loaderObj.options.modules && typeof loaderObj.options.modules === 'object') {
            loaderObj.options.modules.namedExport = false;
            loaderObj.options.modules.exportLocalsConvention = 'camelCase';
          }
        }

        // Modify sass-loader to silence deprecation warnings
        if (loaderObj && loaderObj.loader && loaderObj.loader.includes('sass-loader')) {
          if (!loaderObj.options) loaderObj.options = {};
          if (!loaderObj.options.sassOptions) loaderObj.options.sassOptions = {};

          // Silence deprecation warnings for:
          // - import: @import rule deprecation (requires major refactor to fix)
          // - color-functions: Bootstrap's internal use of red(), green(), blue()
          // - global-builtin: Bootstrap's use of map-has-key instead of map.has-key
          loaderObj.options.sassOptions.silenceDeprecations = ['import', 'color-functions', 'global-builtin'];
        }
      });
    }
  });
}

modifyCssLoaders(webpackConfig.module.rules);

// Shakapacker already handles CSS/SCSS/images/fonts via its generated config.
// We only need to add custom config for things it doesn't handle.
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
      {
        test: /\.(mp3|wav|ogg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name][hash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      url: require.resolve('url/'),
      querystring: require.resolve('querystring-es3'),
    },
  },
};

module.exports = merge(webpackConfig, customConfig);
