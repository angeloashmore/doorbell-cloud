const Billing = require("cloud/classes/Billing");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const User = Parse.Object.extend("_User", {
  // Instance methods
  defaults: {
    "professional": false
  },

  requiredAttrs: [
    "email",
    "name"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  configureDefaultACL: function() {
    const acl = new Parse.ACL(this);
    this.setACL(acl);
    return this.save(null, { useMasterKey: true });
  },

  createBilling: function() {
    const billing = new Billing();
    billing.set({
      "user": this,
      "email": this.get("email")
    });
    return billing.save(null, { useMasterKey: true });
  }

}, {
  // Class methods
});

module.exports = User;
