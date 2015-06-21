const Errors = require("cloud/errors/index");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Role = Parse.Object.extend("_Role", {
  // Instance methods
  requiredAttrs: [
    "team"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  }

}, {
  // Class methods
});

module.exports = Role;
