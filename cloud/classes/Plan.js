const Errors = require("cloud/errors/index");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Plan = Parse.Object.extend("Plan", {
  // Instance methods
  requiredAttrs: [
    "stripePlanId",
    "type"
  ],

  validate: function(attrs, options) {
    if (["user", "organization"].indexOf(this.get("type")) < 0) {
      throw new Errors.InvalidAttrValues(["type"]);
    }

    return validateRequiredAttrs(this.requiredAttrs, attrs);
  }

}, {
  // Class methods
});

module.exports = Plan;
