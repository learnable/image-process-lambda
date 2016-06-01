const imagemin = require("imagemin");
// const advpng = require("imagemin-advpng");
// const jpegoptim = require("imagemin-jpegoptim")
const jpegtran = require("imagemin-jpegtran")
const mozjpeg = require("imagemin-mozjpeg")
const optipng = require("imagemin-optipng");
const pngcrush = require("imagemin-pngcrush");
// const pngout = require("imagemin-pngout");
// const zopfli = require("imagemin-zopfli");

module.exports = function optimize(body, cb) {
  const pngLevel = 7;// FIXME
  imagemin.buffer(body, {
    plugins: [
      jpegtran(),
      mozjpeg(),
      optipng({optimizationLevel: 7}),
      pngcrush(),
    ]
  }).then(function(buf) {
    console.log("Optimized! Final file size is " + buf.length + " bytes");

    cb(null, buf);
  }).catch(function(err){
    console.log("failed to optimize", err);
    cb(err);
  });

}
