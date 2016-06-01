const selectn = require("selectn");

const defaultOptions = {
  destBucketPre: "",
  destBucketPost: "-processed",
  copyUnprocessedFiles: true,
  sizes: [],
  processAtOriginalSize: true,
  skipSize: -1,
  types: ["jpg", "png"],
};

const knownProcessableTypes = ["jpg", "png"];

module.exports = (s3, srcBucket, cb) => {
  s3.getObject({
    Bucket: srcBucket,
    Key: "SP_image_process.json"
  }, (err, data) => {
    if (err) {
      console.log(err);
      return cb("Unable to read SP_image_process.json");
    }

    const srcOptions = (data.Body.length) ? JSON.parse(data.Body.toString("utf-8")) : {};
    const options = mergeOptions(srcBucket, srcOptions);
    const destBucket = getDestBucket(options);

    if (srcBucket === destBucket) return cb("Source and Dest buckets are the same.");

    const config = {
      destBucket,
      options,
      shouldProcessType: (type) => shouldProcessType(type, options)
    };

    console.log("received config", config);
    
    cb(null, config);
  });
}

const mergeOptions = (srcBucket, srcOptions) => 
  Object.assign({destBucket: srcBucket}, defaultOptions, srcOptions);

const getDestBucket = (options) =>
  options.destBucketPre + options.destBucket + options.destBucketPost;

const shouldProcessType = (type, options) =>
  knownProcessableTypes.indexOf(type) !== -1 && options.types.indexOf(type) !== -1;
