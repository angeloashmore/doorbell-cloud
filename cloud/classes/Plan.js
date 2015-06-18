const Enums = require("cloud/enums/Enums");
const Errors = require("cloud/errors/index");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Plan = Parse.Object.extend("Plan", {
  // Instance methods
  requiredAttrs: [
    "stripePlanId",
    "type"
  ],

  validate: function(attrs, options) {
    if (["user", "organization"].indexOf(attrs["type"]) < 0) {
      throw new Errors.InvalidAttrValues(["type"]);
    }

    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

}, {
  // Class methods
  Types: Object.freeze({
    Organization: "organization",
    User: "user"
  }),

  fetchWithStripeId: function(id) {
    const query = new Parse.Query(Plan);
    query.equalTo("stripePlanId", id);
    return query.first();
  },

  fetchDefaultPlanForType: function(type) {
    if (type == Enums.BillingTypes.Organization) {
      return Plan.fetchWithStripeId("ORGANIZATION__FREE");
    } else if (type == Enums.BillingTypes.User) {
      return Plan.fetchWithStripeId("USER__FREE");
    }

    throw new TypeError("Argument 'type' was an invalid value");
  }
});

module.exports = Plan;
