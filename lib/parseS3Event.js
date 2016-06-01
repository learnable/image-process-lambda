const selectn = require("selectn");

module.exports = (event) => {
  const key = parseKey(event);
  return {
    event,
    bucket: parseBucket(event),
    key,
    fileType: parseFileType(key)
  };
};

const parseBucket = (event) => selectn("Records[0].s3.bucket.name", event);

const parseKey = (event) => {
  const key = selectn("Records[0].s3.object.key", event);
  return require("querystring").parse("a=" + key).a;
};

const parseFileType = (key) => {
  const typeMatch = key.match(/\.([^.]*)$/);
  return selectn("[1]", typeMatch);
};
