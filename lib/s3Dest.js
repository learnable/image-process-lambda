const selectn = require("selectn");

module.exports = (s3, srcBucket, srcKey, destBucket, LAMBDA_VERSION) => ({
  copy: (cb) => {
    s3.copyObject({
      Bucket: destBucket,
      Key: srcKey,
      CopySource: srcBucket + "/" + srcKey,
      ACL: "public-read", // TODO: make configurable
    }, cb);
  },

  head: (destKey, cb) => {
    s3.headObject({
      Bucket: destBucket,
      Key: destKey
    }, cb);
  },

  put: (destKey, body, contentType, metadata, cb) => {
    s3.putObject({
      ACL: "public-read", // TODO: make configurable
      Bucket: destBucket,
      Key: destKey,
      Body: body,
      ContentType: contentType,
      Metadata: metadata
    }, cb);
  },

  isAlreadyProcessed: (destKey, srcETag, cb) => {
    s3.headObject({
      Bucket: destBucket,
      Key: destKey
    }, (err, destData) => {
      //swallow error as file may not already be at dest
      if (!err) console.log("Got dest data:", destData);

      if (selectn("Metadata.sp_image_processed_etag", destData) === srcETag
         && selectn("Metadata.sp_image_process_version", destData) === LAMBDA_VERSION) {
        console.log("processed image already at dest", destKey)
        return cb(null, true);
      }
      return cb(null, false);
    });
  },

  putWithMeta: (srcData, destKey) => {
    const metadata = Object.assign({}, srcData.Metadata, {
      sp_image_process_etag: srcData.ETag,
      sp_image_process_version: LAMBDA_VERSION,
    });
    
    console.log("putWithMeta", srcData, metadata);

    return (body, cb) => {
      s3.putObject({
        ACL: "public-read", // TODO: make configurable
        Bucket: destBucket,
        Key: destKey,
        Body: body,
        ContentType: srcData.ContentType,
        Metadata: metadata
      }, cb);
    };
  }
});
