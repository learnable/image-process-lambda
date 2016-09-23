const imagemin = require("imagemin");
// const jpegoptim = require("imagemin-jpegoptim")
const jpegtran = require("imagemin-jpegtran")
const mozjpeg = require("imagemin-mozjpeg")
// const advpng = require("imagemin-advpng");
const optipng = require("imagemin-optipng");
const pngcrush = require("imagemin-pngcrush");
// const pngout = require("imagemin-pngout");
const zopfli = require("imagemin-zopfli");

module.exports = function optimize(body, cb) {
  const pngLevel = 7;// FIXME
  imagemin.buffer(body, {
    plugins: [
      // jpegoptim(),
      jpegtran(),
      mozjpeg(),
      // advpng(),
      optipng({optimizationLevel: 7}),
      pngcrush(),
      // pngout(),
      zopfli(),
    ]
  }).then(function(buf) {
    console.log("Optimized! Final file size is " + buf.length + " bytes");

    cb(null, buf);
  }).catch(function(err){
    console.log("failed to optimize", err);
    cb(err);
  });

}

/**
 * Node Module Status
 *
 * On EC2
 * jpegoptim - post install fails 23/8/16
 * advpng - installs ok but breaks script 23/8/16
 * pngout - installs ok but breaks script 23/8/16
 *
 * Still to investigate
 * Gifsicle
 */
