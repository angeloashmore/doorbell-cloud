const Errors = require("cloud/errors/index");

module.exports = function(requiredAttrs, object) {
  const missingAttrs = [];

  requiredAttrs.forEach(function(key) {
    var isMissing = false;

    switch (typeof key) {
      case "string":
        if (object[key].length <= 0) isMissing = true;
        break;
      default:
        if (object[key] === undefined) isMissing = true
        break;
    }

    if (isMissing) missingAttrs.push(key);
  });

  if (missingAttrs.length > 0) {
    throw new Errors.RequiredAttrsMissing(missingAttrs);
  }

  return false;
}
