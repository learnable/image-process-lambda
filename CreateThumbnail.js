// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var selectn = require('selectn');

var S3Event = require("./lib/S3Event");
var s3Dest = require("./lib/s3Dest");
var s3Src = require("./lib/s3Src");

var size = require("./lib/size");
var keyForSize = size.keyForSize;
var resizeTo = size.resizeTo;
var optimize = require("./lib/optimize");

var LAMBDA_VERSION = "0.0.1"; // TODO move version to SP_image_process.json

// get reference to S3 client 
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = function(event, context, callback) {
  var s3Event = new S3Event(event);

  async.waterfall([
    function getSrcConfig(next) {
      console.log("getting config");
      s3Src(s3, s3Event.bucket, next);
    },
    function processByType(config, next) {
      console.log("beginning process");
      var destS3 = s3Dest(s3, s3Event.bucket, s3Event.key, config.destBucket, LAMBDA_VERSION);

      if(config.shouldProcessType(s3Event.fileType)) {
        console.log("Should process " + s3Event.fileType);
        s3.getObject({
          Bucket: s3Event.bucket,
          Key: s3Event.key
        }, function(err, srcData) {
          if (err) {
            console.log("couldnt get Object", err);
            return next(err);
          }
          console.log("Got object", srcData);
          
          if (config.options.skipSize !== -1 && srcData.ContentLength > config.options.skipSize) {
            console.log("Skipping due to size");
            return destS3.copy(next);
          }

          if (config.options.processAtOriginalSize) config.options.sizes.push(null);

          var tasks = config.options.sizes.map(function(size) {
            var destKey = keyForSize(s3Event.key, size);

            return function(cb) {
              destS3.head(destKey, function(err, destData) {
                //swallow error as file may not already be at dest
                if (!err) console.log("Got dest data:", destData);

                if (selectn("Metadata.sp_image_processed", destData) === LAMBDA_VERSION) {
                  console.log("processed image already at dest", destKey)
                  return cb();
                }

                async.waterfall([
                  resizeTo(srcData.Body, size, s3Event.fileType),
                  optimize,
                  destS3.putWithMeta(srcData, destKey)
                ], cb);
              });
            }
          });
          console.log("Tasks", tasks);

          return async.parallel(tasks, next);
        });
      } else if (config.options.copyUnprocessedFiles) {
        console.log("Copy unprocessed file");
        return destS3.copy(next);
      } else {
        console.log("shouldnt process or copy")
        next();
      }
    }
  ], function(err){
    context.done(err);
  });
};
