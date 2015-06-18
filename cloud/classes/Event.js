const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Event = Parse.Object.extend("Event", {
  // Instance methods
  requiredAttrs: [
    "user",
    "location",
    "description"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  }

}, {
  // Class methods
});

module.exports = Event;
