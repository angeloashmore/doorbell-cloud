function InvalidAttrValue(attrName, message) {
  this.name = "InvalidAttrValue";
  this.message = message || "Attribute '" + attrName + "' does not have a valid value";
  this.stack = (new Error()).stack;
}
InvalidAttrValue.prototype = Object.create(Error.prototype);
InvalidAttrValue.prototype.constructor = InvalidAttrValue;

module.exports = InvalidAttrValue;
