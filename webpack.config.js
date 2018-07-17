const path = require('path');

require('browserify');
require('coffee-loader');

module.exports = {
  // resolve: {
  //   alias: {
  //
  //     // all upgraded AngularJS modules will now be forced to
  //     // use the same version of AngularJS, removing the
  //     // "Tried to load angular more than once." warning.
  //     angular: path.resolve(__dirname, 'node_modules/angular')
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: ['coffee-loader']
      }
    ]
  },
  externals: [
    'alac'
  ],
};
