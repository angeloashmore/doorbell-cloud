function RequiredAttrsMissing(attrNames, message) {
  this.name = "RequiredAttrsMissing";
  this.message = message || "Required attribute(s) " + attrNames.join(", ") + " missing";
  // this.stack = (new Error()).stack;
}
RequiredAttrsMissing.prototype = Object.create(Error.prototype);
RequiredAttrsMissing.prototype.constructor = RequiredAttrsMissing;

module.exports = RequiredAttrsMissing;
