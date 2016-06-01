var selectn = require('selectn');

var defaultOptions = {
  destBucketPre: "",
  destBucketPost: "-processed",
  copyUnprocessedFiles: true,
  sizes: [],
  processAtOriginalSize: true,
  skipSize: -1,
  types: ["jpg", "png"],
};

var knownProcessableTypes = ["jpg", "png"];

function s3Src(s3, srcBucket, cb) {
  s3.getObject({
    Bucket: srcBucket,
    Key: "SP_image_process.json"
  }, function(err, data) {
    if (err) {
      console.log(err);
      return cb("Unable to read SP_image_process.json");
    }

    var srcOptions = (data.Body.length) ? JSON.parse(data.Body.toString('utf-8')) : {};
    var options = mergeOptions(srcBucket, srcOptions);
    var destBucket = getDestBucket(options);

    if (srcBucket === destBucket) return cb("Source and Dest buckets are the same.");

    var config = {
      destBucket: destBucket,
      options: options,
      shouldProcessType: function(type) { 
        return shouldProcessType(type, options);
      }
    };

    console.log("received config", config);
    
    cb(null, config);
  });
}

function mergeOptions(srcBucket, srcOptions) {
  return Object.assign({destBucket: srcBucket}, defaultOptions, srcOptions);
}

function getDestBucket(options) {
  return options.destBucketPre + options.destBucket + options.destBucketPost;
}

function shouldProcessType(type, options) {
  return knownProcessableTypes.indexOf(type) !== -1 && options.types.indexOf(type) !== -1;
}

module.exports = s3Src;

