const Errors = require("cloud/errors/index");

module.exports = function(requiredAttrs, object) {
  requiredAttrs.forEach(function(key) {
    if (object[key] === undefined) throw new Errors.RequiredAttrMissing(key);
  });

  return false;
}
