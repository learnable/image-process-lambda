var selectn = require('selectn');

function S3Event(event) {
  this.event = event;
  this.parseBucket();
  this.parseKey();
  this.parseFileType();
}

S3Event.prototype.parseBucket = function parseBucket()  {
  this.bucket = selectn("Records[0].s3.bucket.name", this.event);
};

S3Event.prototype.parseKey = function parseKey()  {
  var key = selectn("Records[0].s3.object.key", this.event);
  this.key = require('querystring').parse('a=' + key).a;
};

S3Event.prototype.parseFileType = function parseFileType()  {
    var typeMatch = this.key.match(/\.([^.]*)$/);
    this.fileType = selectn("[1]", typeMatch);
};

module.exports = S3Event;
