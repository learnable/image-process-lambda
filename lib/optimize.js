var imagemin = require('imagemin');
// var advpng = require('imagemin-advpng');
// var jpegoptim = require('imagemin-jpegoptim')
var jpegtran = require('imagemin-jpegtran')
var mozjpeg = require('imagemin-mozjpeg')
var optipng = require('imagemin-optipng');
var pngcrush = require('imagemin-pngcrush');
// var pngout = require('imagemin-pngout');
// var zopfli = require('imagemin-zopfli');

module.exports = function optimize(body, cb) {
  var pngLevel = 7;// FIXME
  imagemin.buffer(body, {
    plugins: [
      jpegtran(),
      mozjpeg(),
      optipng({optimizationLevel: 7}),
      pngcrush(),
    ]
  }).then(function(buf) {
    console.log('Optimized! Final file size is ' + buf.length + ' bytes');

    cb(null, buf);
  }).catch(function(err){
    console.log('failed to optimize', err)
    cb(err);
  });

}
