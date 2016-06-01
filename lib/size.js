var gm = require('gm')
          .subClass({ imageMagick: true }); // Enable ImageMagick integration.
var selectn = require('selectn');


/**
 * eg. size
 * {
 *    keyPre: null,
 *    keyPost: "-large",
 *    width: 500,
 *    height: null
 * }
 */
// TODO upsize boolean option
module.exports = {
  keyForSize: function keyForSize(srcKey, size) {
    if (!size) return srcKey;

    var typeMatch = srcKey.match(/(.*)\.([^.]*)$/);
    if (!typeMatch) return srcKey;
    var keyName = selectn("[1]", typeMatch);
    var keyType = selectn("[2]", typeMatch);

    var pre = selectn("keyPre", size) || "";
    var post = selectn("keyPost", size) || "";
    return pre + keyName + post + "." + keyType;
  },

  resizeTo: function resizeTo(buf, size, format) {
    return function(cb) {
      if (!size) {
        console.log("skipped resize");
        return cb(null, buf);
      }

      var width = selectn("width", size);
      var height = selectn("height", size);
      gm(buf)
        .resize(width, height)
        .toBuffer(format, function(err, buf) {
          if (err) {
            console.log("failed to resize", err);
            return cb(err);
          }

          console.log("resized", size);
          cb(null, buf);
        });
    };
  }
};
