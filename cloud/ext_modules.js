const Stripe = require('stripe');
const config = require('cloud/config');

Stripe.initialize(config.STRIPE_PUBLISHABLE_KEY);
exports.Stripe = Stripe;

exports.validateRequiredColumns = function(object, requiredColumns) {
  for (let columnName in requiredColumns) {
    if (!object.get(columnName)) {
      if (requiredColumns[columnName]) {
        user.set(columnName, requiredColumns[columnName]);
      } else {
        var errorMessage = columnName + " is required";
        return Parse.Error(Parse.Error.VALIDATION_ERROR, errorMessage);
      }
    }
  }

  return true
}
