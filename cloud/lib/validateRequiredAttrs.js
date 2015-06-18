const Errors = require("cloud/errors/index");

module.exports = function(requiredAttrs, object) {
  const missingAttrs = [];

  requiredAttrs.forEach(function(key) {
    if (object[key] === undefined) missingAttrs.push(key);
  });

  if (missingAttrs.length > 0) {
    throw new Errors.RequiredAttrsMissing(missingAttrs);
  }

  return false;
}
