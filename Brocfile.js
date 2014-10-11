/* global require, module */
var compileCoffee = require('broccoli-coffee');
var uglifyJavaScript = require('broccoli-uglify-js');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var pickFiles = require('broccoli-static-compiler');
var moveFile = require('broccoli-file-mover');
var inlineTemplatePrecompiler = require('./lib/broccoli-ember-inline-template-precompiler');
var banner = require('./lib/broccoli-banner')

var env = process.env.EMBER_ENV || 'development';

var tree = compileCoffee('packages');
tree = inlineTemplatePrecompiler(tree);
tree = concat(tree, {
  inputFiles: ['ember-strap.js', '**/*.js'],
  wrapInEval: env !== 'production',
  outputFile: '/ember-strap.js'
});
// Build dist
if (env == 'production') {
  minPackages = moveFile(tree, {
    srcFile: 'ember-strap.js',
    destFile: 'ember-strap.min.js'
  });
  minPackages = uglifyJavaScript(minPackages, {
      // mangle: false,
      // compress: false
  });
  tree = mergeTrees([tree, minPackages]);
  tree = banner(tree);
}

if (env != 'production') {

  var EmberApp = require('ember-cli/lib/broccoli/ember-app');

  var app = new EmberApp({name: 'doc', tests: env != 'doc'});

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/highlightjs/styles/github.css')
  app.import('bower_components/highlightjs/highlight.pack.js');

  app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

  app.import('bower_components/font-awesome/css/font-awesome.css')
  var fontAwesome = pickFiles('bower_components/font-awesome', {
    srcDir: '/fonts',
    files: ['*'],
    destDir: '/fonts'
  });

  var pacifico = pickFiles('vendor/pacifico', {
    srcDir: '/',
    files: ['*'],
    destDir: '/fonts'
  });
  tree = app.toTree([fontAwesome, pacifico, tree]);
}

module.exports = tree;
