function MismatchedBillingType(message) {
  this.name = "MismatchedBillingType";
  this.message = message || "Billing Types did not match"
  // this.stack = (new Error()).stack;
}
MismatchedBillingType.prototype = Object.create(Error.prototype);
MismatchedBillingType.prototype.constructor = MismatchedBillingType;

module.exports = MismatchedBillingType;
