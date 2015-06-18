function InvalidAttrValues(attrNames, message) {
  this.name = "InvalidAttrValues";
  this.message = message || "Attribute(s) " + attrNames.join(", ") + " do not have a valid value";
  // this.stack = (new Error()).stack;
}
InvalidAttrValues.prototype = Object.create(Error.prototype);
InvalidAttrValues.prototype.constructor = InvalidAttrValues;

module.exports = InvalidAttrValues;
