// const gm = require("gm")
//           .subClass({ imageMagick: true }); // Enable ImageMagick integration.
const selectn = require("selectn");


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
  keyForSize: (srcKey, size) => {
    if (!size) return srcKey;

    const typeMatch = srcKey.match(/(.*)\.([^.]*)$/);
    if (!typeMatch) return srcKey;
    const keyName = selectn("[1]", typeMatch);
    const keyType = selectn("[2]", typeMatch);

    const pre = selectn("keyPre", size) || "";
    const post = selectn("keyPost", size) || "";

    return pre + keyName + post + "." + keyType;
  },

  /*resizeTo: (buf, size, format) => {
    return (cb) => {
      if (!size) {
        console.log("skipped resize");
        return cb(null, buf);
      }

      const width = selectn("width", size);
      const height = selectn("height", size);
      gm(buf)
        .resize(width, height)
        .toBuffer(format, (err, buf) => {
          if (err) {
            console.log("failed to resize", err);
            return cb(err);
          }

          console.log("resized", size);
          cb(null, buf);
        });
    };
  }*/
};
