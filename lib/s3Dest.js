module.exports = function curriedS3(s3, srcBucket, srcKey, destBucket, LAMBDA_VERSION) {
  return {
    copy: function (cb) {
      s3.copyObject({
        Bucket: destBucket,
        Key: srcKey,
        CopySource: srcBucket + "/" + srcKey,
      }, cb);
    },

    head: function (destKey, cb) {
      s3.headObject({
        Bucket: destBucket,
        Key: destKey
      }, cb);
    },

    put: function (destKey, body, contentType, metadata, cb) {
      s3.putObject({
        Bucket: destBucket,
        Key: destKey,
        Body: body,
        ContentType: contentType,
        Metadata: metadata
      }, cb);
    },

    putWithMeta: function (srcData, destKey) {
      var metadata = Object.assign({}, srcData.Metadata, {sp_image_processed: LAMBDA_VERSION});

      return function (body, cb) {
        s3.putObject({
          Bucket: destBucket,
          Key: destKey,
          Body: body,
          ContentType: srcData.contentType,
          Metadata: metadata
        }, cb);
      };
    }
  };
}
