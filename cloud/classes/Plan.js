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

  fetchDefaultPlanForType: function(type) {
    var planName;

    switch (type) {
      case Plan.Types.Organization:
        planName = "ORGANIZATION__FREE";
        break;

      case Plan.Types.User:
        planName = "USER__FREE";
        break;

      default:
        throw new TypeError("Argument 'type' was an invalid value");
    }

    const query = new Parse.Query(Plan);
    query.equalTo("stripePlanId", planName);
    return query.first();
  }
});

module.exports = Plan;
