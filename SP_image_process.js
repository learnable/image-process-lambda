const async = require("async");
const AWS = require("aws-sdk");

const parseS3Event = require("./lib/parseS3Event");
const s3Dest = require("./lib/s3Dest");
const s3Src = require("./lib/s3Src");

const size = require("./lib/size");
const keyForSize = size.keyForSize;
// const resizeTo = size.resizeTo;
const optimize = require("./lib/optimize");

const LAMBDA_VERSION = "0.0.2"; // TODO move version to SP_image_process.json

// get reference to S3 client 
const s3 = new AWS.S3({apiVersion: "2006-03-01"});

exports.handler = (event, context, callback) => {
  const s3Event = parseS3Event(event);

  async.waterfall([
    (next) => {
      console.log("getting config");
      s3Src(s3, s3Event.bucket, next);
    },
    (config, next) => {
      console.log("beginning process");
      const destS3 = s3Dest(s3, s3Event.bucket, s3Event.key, config.destBucket, LAMBDA_VERSION);

      if(config.shouldProcessType(s3Event.fileType)) {
        console.log("Should process " + s3Event.fileType);
        s3.getObject({
          Bucket: s3Event.bucket,
          Key: s3Event.key
        }, (err, srcData) => {
          if (err) {
            console.log("couldnt get Object", err);
            return next(err);
          }
          console.log("Got object", srcData);
          
          if (config.shouldSkipSize(srcData.ContentLength)) {
            console.log("Skipping due to size");
            return destS3.copy(next);
          }

          const tasks = config.sizes.map((size) => {
            const destKey = keyForSize(s3Event.key, size);

            return (cb) => {
              destS3.isAlreadyProcessed(destKey, srcData.ETag, function(err, hasAlreadyProcessed) {
                if (hasAlreadyProcessed) return cb();

                async.waterfall([
                  // resizeTo(srcData.Body, size, s3Event.fileType),
                  // optimize,
                  (cb) => optimize(srcData.Body, cb),
                  destS3.putWithMeta(srcData, destKey)
                ], cb);
              });
            }
          });
          console.log("Tasks", tasks);

          return async.parallel(tasks, next);
        });
      } else if (config.shouldCopyUnprocessedFiles) {
        console.log("Copy unprocessed file");
        return destS3.copy(next);
      } else {
        console.log("shouldnt process or copy")
        next();
      }
    }
  ], (err) => context.done(err) );
};
