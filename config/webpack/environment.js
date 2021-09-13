const {environment} = require('@rails/webpacker');
const webpack = require('webpack');
environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery/src/jquery',
    jQuery: 'jquery/src/jquery',
  }),
);
const nodeModulesLoader = environment.loaders.get('nodeModules');
if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = nodeModulesLoader.exclude == null ? [] : [nodeModulesLoader.exclude];
}

nodeModulesLoader.exclude.push(/react-table/);

environment.loaders.append('typescript', {
  test: /.(ts|tsx)$/,
  loader: 'ts-loader',
});

module.exports = environment;
