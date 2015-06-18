const Stripe = require("cloud/lib/Stripe");
const OrganizationRoleTypes = require("cloud/classes/OrganizationRoleTypes");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Billing = Parse.Object.extend("Billing", {
  // Instance methods
  requiredAttrs: [
    "email"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  configureDefaultACL: function() {
    Parse.Cloud.useMasterKey();

    const user = this.get("user");
    const organization = this.get("organization");
    const acl = new Parse.ACL();

    if (!!user) {
      acl.setReadAccess(user, true);
      acl.setWriteAccess(user, true);
    } else if (!!organization) {
      acl.setRoleReadAccess(organization.roleNameForType(OrganizationRoleTypes.Billing), true);
      acl.setRoleWriteAccess(organization.roleNameForType(OrganizationRoleTypes.Billing), true);
    }

    this.setACL(acl);
    return this.save();
  },

  createStripeCustomer: function() {
    Parse.Cloud.useMasterKey();

    const data = {
      email: this.get("email"),
      metadata: { parseBillingId: this.id }
    };

    const this_ = this;
    return Stripe.Customers.create(data)
      .then(function(stripeCustomer) {
        this_.set("stripeCustomerId", stripeCustomer.id);
        return this_.save();
      });
  },

  configureDefaultPlan: function() {
    if (!!this.get("organization")) {
      const this_ = this;
      const query = new Parse.Query("Plan");
      query.equalTo("stripePlanId", "ORGANIZATION__FREE");
      return query.first()
        .then(function(plan) {
          this_.set("plan", plan);
          return this_.save();
        });
    }
  }

}, {
  // Class methods
});

module.exports = Billing;
