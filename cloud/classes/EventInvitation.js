const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const EventInvitation = Parse.Object.extend("EventInvitation", {
  // Instance methods
  defaults: {
    "accepted": false
  },

  requiredAttrs: [
    "event",
    "user",
    "accepted"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  }

}, {
  // Class methods
});

module.exports = EventInvitation;
