function RequiredAttrMissing(attrName, message) {
  this.name = "RequiredAttrMissing";
  this.message = message || "Required attribute '" + attrName + "' missing";
  // this.stack = (new Error()).stack;
}
RequiredAttrMissing.prototype = Object.create(Error.prototype);
RequiredAttrMissing.prototype.constructor = RequiredAttrMissing;

module.exports = RequiredAttrMissing;
