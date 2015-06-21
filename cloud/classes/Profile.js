const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Profile = Parse.Object.extend("Profile", {
  // Instance methods
  defaults: {
    "private": false
  },

  requiredAttrs: [
    "user",
    "team",
    "private"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  configureDefaultACL: function() {
    const user = this.get("user");
    const acl = new Parse.ACL(user);
    this.setACL(acl);
    return this.save(null, { useMasterKey: true });
  }

}, {
  // Class methods
});

module.exports = Profile;
