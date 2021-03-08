// webpack.config.js
const Encore = require('@symfony/webpack-encore');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');

const { resolve } = require('path');

Encore
  // directory where all compiled assets will be stored
  .setOutputPath('./local/assets/css_js/')

  // what's the public path to this directory (relative to your project's document root dir)
  .setPublicPath('/local/assets/css_js/')

  // empty the outputPath dir before each build
  .cleanupOutputBeforeBuild()

  // will output as web/build/app.js
  .addEntry('main', './local/distr/scripts/main.js')

  .enableVueLoader()

  // will output as web/build/global.css
  .addStyleEntry('global', './local/distr/styles/global.scss')

  // allow sass/scss files to be processed
  .enableSassLoader(() => {
  }, { resolveUrlLoader: false })
  .enablePostCssLoader()


  // allow legacy applications to use $/jQuery as a global variable
  // .autoProvidejQuery()

  // you can use this method to provide other common global variables,
  // such as '_' for the 'underscore' library
  .autoProvideVariables({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    BX: 'BX',
    'window.BX': 'BX',
  })

  .enableSourceMaps(!Encore.isProduction())

  // https://webpack.js.org/plugins/define-plugin/
  .configureDefinePlugin((options) => {
    options.DEBUG = !Encore.isProduction();
  })

  // create hashed filenames (e.g. app.abc123.css)

  .configureFilenames({
    js: '[name].[hash:8].js',
  })

  .enableVersioning()
  .enableSingleRuntimeChunk();

const config = Encore.getWebpackConfig();

if (Encore.isProduction) {
  config.plugins.push(new UglifyEsPlugin({
    compress: {
      drop_console: true,
    },
  }));
}
config.resolve.alias = Object.assign({}, config.resolve.alias, {
  '@distrjs': resolve(__dirname, 'local/distr/scripts'),
});

config.externals = {
  jquery: 'jQuery',
  BX: 'BX',
};


// export the final configuration
module.exports = config;
