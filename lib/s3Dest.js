module.exports = (s3, srcBucket, srcKey, destBucket, LAMBDA_VERSION) => ({
  copy: (cb) => {
    s3.copyObject({
      Bucket: destBucket,
      Key: srcKey,
      CopySource: srcBucket + "/" + srcKey,
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
      Bucket: destBucket,
      Key: destKey,
      Body: body,
      ContentType: contentType,
      Metadata: metadata
    }, cb);
  },

  putWithMeta: (srcData, destKey) => {
    const metadata = Object.assign({}, srcData.Metadata, {sp_image_processed: LAMBDA_VERSION});

    return (body, cb) => {
      s3.putObject({
        Bucket: destBucket,
        Key: destKey,
        Body: body,
        ContentType: srcData.contentType,
        Metadata: metadata
      }, cb);
    };
  }
});
